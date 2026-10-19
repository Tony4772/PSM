export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  try {
    const { amount, orderNumber, customerName, customerPhone } = req.body || {};
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Monto de la orden inválido.' });
    }

    const secretKey = process.env.CULQI_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: 'CULQI_SECRET_KEY no está configurada.' });
    }

    const nameParts = String(customerName || 'Cliente').trim().split(/\s+/);
    const firstName = nameParts.shift() || 'Cliente';
    const lastName = nameParts.join(' ') || 'PSM';
    const phoneDigits = String(customerPhone || '').replace(/\D/g, '');
    const localPhone = phoneDigits.startsWith('51') && phoneDigits.length === 11
      ? phoneDigits.slice(2)
      : phoneDigits;
    if (localPhone.length !== 9) {
      return res.status(400).json({ error: 'Ingresa un celular peruano válido de 9 dígitos.' });
    }
    const expirationDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

    const orderPayload = {
      amount: Math.round(numericAmount * 100),
      currency_code: 'PEN',
      description: `Pedido ${orderNumber || 'PSM'} - Piqueos San Miguel`,
      order_number: orderNumber || `PSM-${Date.now()}`,
      client_details: {
        first_name: firstName,
        last_name: lastName,
        email: 'cliente@piqueossanmiguel.pe',
        phone_number: `+51${localPhone}`,
      },
      expiration_date: expirationDate,
    };

    const culqiResponse = await fetch('https://api.culqi.com/v2/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const data = await culqiResponse.json();

    if (!culqiResponse.ok || !data.id) {
      const errorDetail =
        data.user_message || data.merchant_message || data.message || 'Culqi no pudo crear la orden de pago.';
      return res.status(culqiResponse.status || 502).json({ error: errorDetail });
    }

    return res.status(200).json({ orderId: data.id });
  } catch (error: any) {
    console.error('Error creando orden de Culqi:', error);
    return res.status(500).json({
      error: error.message || 'Error interno al preparar la orden de pago con Culqi.',
    });
  }
}
