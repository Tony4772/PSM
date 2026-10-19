export default async function handler(req: any, res: any) {
  // Configurar headers CORS
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
    const { token, amount, email, orderNumber, customerName, customerPhone } = req.body || {};

    if (!token) {
      return res.status(400).json({ error: 'Token de Culqi requerido.' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Monto a pagar inválido.' });
    }

    const secretKey = process.env.CULQI_SECRET_KEY || 'sk_live_5Sc2O9AqIvnvJTqm';
    const amountInCents = Math.round(Number(amount) * 100);

    const chargePayload = {
      amount: amountInCents,
      currency_code: 'PEN',
      email: email || 'cliente@piqueossanmiguel.pe',
      source_id: token,
      description: `Pedido ${orderNumber || 'PSM'} - Piqueos San Miguel (${customerName || 'Cliente'})`,
      metadata: {
        orderNumber: orderNumber || '',
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        empresa: 'EBYZOM E.I.R.L.',
        ruc: '20614121042',
      },
    };

    const culqiResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(chargePayload),
    });

    const data = await culqiResponse.json();

    if (!culqiResponse.ok) {
      const errorDetail =
        data.user_message || data.merchant_message || data.message || 'Error al procesar el pago con Culqi.';
      return res.status(culqiResponse.status).json({
        success: false,
        error: errorDetail,
        culqiRaw: data,
      });
    }

    return res.status(200).json({
      success: true,
      chargeId: data.id,
      amount: data.amount / 100,
      currency: data.currency_code,
      referenceCode: data.reference_code,
      outcome: data.outcome,
      message: '¡Pago procesado exitosamente con Culqi!',
    });
  } catch (err: any) {
    console.error('Error procesando cargo en Culqi:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error interno del servidor al procesar el cobro con Culqi.',
    });
  }
}
