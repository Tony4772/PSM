export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  try {
    const {
      orderNumber,
      comprobante = 'boleta',
      customerName = 'Cliente',
      customerPhone = '',
      customerEmail = '',
      facturaDetails,
      cartItems = [],
      total = 0,
      deliveryFee = 0,
    } = req.body || {};

    const token = process.env.APISPERU_TOKEN;
    if (!token) {
      return res.status(500).json({ success: false, error: 'APISPERU_TOKEN no está configurado.' });
    }
    if (comprobante !== 'boleta' && comprobante !== 'factura') {
      return res.status(400).json({ success: false, error: 'Tipo de comprobante inválido.' });
    }

    const totalAmount = Number(total);
    const numericDeliveryFee = Number(deliveryFee);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0 || !Number.isFinite(numericDeliveryFee) || numericDeliveryFee < 0) {
      return res.status(400).json({ success: false, error: 'Importe del comprobante inválido.' });
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'El comprobante debe incluir al menos un producto.' });
    }
    if (
      cartItems.some((item: any) =>
        !Number.isFinite(Number(item.price)) || Number(item.price) < 0 ||
        !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0
      )
    ) {
      return res.status(400).json({ success: false, error: 'Hay productos con precio o cantidad inválidos.' });
    }
    const calculatedTotal = cartItems.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      numericDeliveryFee
    );
    if (Math.abs(calculatedTotal - totalAmount) > 0.02) {
      return res.status(400).json({ success: false, error: 'El total no coincide con los productos y el envío.' });
    }

    const isFactura = comprobante === 'factura';
    if (isFactura && (!/^\d{11}$/.test(String(facturaDetails?.ruc || '')) ||
      !String(facturaDetails?.razonSocial || '').trim() ||
      !String(facturaDetails?.direccionFiscal || '').trim())) {
      return res.status(400).json({ success: false, error: 'RUC, razón social y dirección fiscal son obligatorios para emitir factura.' });
    }

    const tipoDoc = isFactura ? '01' : '03'; // 01 Factura, 03 Boleta
    const serie = isFactura ? 'F001' : 'B001';

    // Generar correlativo aleatorio basado en tiempo para el ticket
    const correlativo = String(Math.floor(Date.now() % 1000000)).padStart(6, '0');

    // Desglose de IGV 18%
    const totalImpuestos = Number((totalAmount * 0.18 / 1.18).toFixed(2));
    const mtoOperGravadas = Number((totalAmount - totalImpuestos).toFixed(2));

    // Construcción de ítems para SUNAT
    const details = cartItems.map((item: any) => {
      const itemTotal = Number(item.price) * Number(item.quantity);
      const igvItem = Number((itemTotal * 0.18 / 1.18).toFixed(2));
      const valorItem = Number((itemTotal - igvItem).toFixed(2));
      const valorUnitario = Number((valorItem / item.quantity).toFixed(2));

      return {
        tipAfeIgv: '10', // Gravado - Operación Onerosa
        codProducto: item.id || 'ITEM-01',
        unidad: 'NIU',
        descripcion: `${item.name} (${item.portionLabel || 'Estándar'})`,
        cantidad: Number(item.quantity),
        mtoValorUnitario: valorUnitario,
        mtoValorVenta: valorItem,
        mtoBaseIgv: valorItem,
        porcentajeIgv: 18,
        igv: igvItem,
        totalImpuestos: igvItem,
        mtoPrecioUnitario: Number(item.price),
      };
    });

    if (numericDeliveryFee > 0) {
      const igvDel = Number((numericDeliveryFee * 0.18 / 1.18).toFixed(2));
      const valDel = Number((numericDeliveryFee - igvDel).toFixed(2));
      details.push({
        tipAfeIgv: '10',
        codProducto: 'DELIVERY',
        unidad: 'ZZ',
        descripcion: 'Servicio de Despacho y Entrega a Domicilio',
        cantidad: 1,
        mtoValorUnitario: valDel,
        mtoValorVenta: valDel,
        mtoBaseIgv: valDel,
        porcentajeIgv: 18,
        igv: igvDel,
        totalImpuestos: igvDel,
        mtoPrecioUnitario: numericDeliveryFee,
      });
    }

    const dateParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date()).reduce((parts: Record<string, string>, part) => {
      parts[part.type] = part.value;
      return parts;
    }, {});
    const fechaEmision = `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}-05:00`;

    const payload = {
      ublVersion: '2.1',
      tipoOperacion: '0101',
      tipoDoc,
      serie,
      correlativo,
      fechaEmision,
      formaPago: {
        moneda: 'PEN',
        tipo: 'Contado',
      },
      tipoMoneda: 'PEN',
      client: {
        tipoDoc: isFactura ? '6' : '0',
        numDoc: isFactura ? facturaDetails.ruc : '00000000',
        rznSocial: isFactura ? facturaDetails.razonSocial : (customerName || 'CLIENTES VARIOS'),
        address: {
          direccion: isFactura ? facturaDetails.direccionFiscal : 'Lima',
        },
      },
      company: {
        ruc: '20614121042',
        razonSocial: 'EBYZOM E.I.R.L',
        nombreComercial: 'PIQUEOS SAN MIGUEL',
        address: {
          ubigeo: '150136',
          departamento: 'LIMA',
          provincia: 'LIMA',
          distrito: 'SAN MIGUEL',
          urbanizacion: '-',
          direccion: 'JR. COMANDANTE JUAN GUILLERMO MOORE 296',
          codLocal: '0000',
        },
      },
      mtoOperGravadas,
      mtoIGV: totalImpuestos,
      totalImpuestos,
      valorVenta: mtoOperGravadas,
      subTotal: totalAmount,
      mtoImpVenta: totalAmount,
      details,
      legends: [
        {
          code: '1000',
          value: `SON ${totalAmount.toFixed(2)} SOLES`,
        },
      ],
    };

    const apisPeruResp = await fetch('https://facturacion.apisperu.com/api/v1/invoice/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await apisPeruResp.json();
    const sunatCode = data.sunatResponse?.cdrResponse?.codRespuesta;
    const rejectedBySunat = sunatCode !== undefined && String(sunatCode) !== '0';
    const hasOfficialReceiptData = Boolean(data.xml && data.hash && data.sunatResponse);
    if (
      !apisPeruResp.ok ||
      data.success === false ||
      data.sunatResponse?.success === false ||
      rejectedBySunat ||
      !hasOfficialReceiptData
    ) {
      const errorDetail =
        data.error ||
        data.message ||
        data.sunatResponse?.cdrResponse?.descripcion ||
        'APISPeru/SUNAT no confirmó la emisión del comprobante.';
      return res.status(502).json({
        success: false,
        mode: 'sunat_rejected',
        error: errorDetail,
      });
    }

    return res.status(200).json({
      success: true,
      mode: 'sunat_production',
      tipoComprobante: isFactura ? 'Factura Electrónica' : 'Boleta de Venta Electrónica',
      serieCorrelativo: `${serie}-${correlativo}`,
      empresa: 'EBYZOM E.I.R.L.',
      rucEmisor: '20614121042',
      direccionEmisor: 'JR. COMANDANTE JUAN GUILLERMO MOORE 296, SAN MIGUEL, LIMA',
      xml: data.xml,
      hash: data.hash,
      sunatResponse: data.sunatResponse,
      montoTotal: totalAmount,
    });
  } catch (error: any) {
    console.error('Error al emitir comprobante:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al comunicarse con el servicio de facturación SUNAT.',
    });
  }
}
