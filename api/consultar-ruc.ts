export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { ruc, dni } = req.query || {};

  // Caso RUC de la propia empresa EBYZOM
  if (ruc === '20614121042') {
    return res.status(200).json({
      success: true,
      ruc: '20614121042',
      razonSocial: 'EBYZOM E.I.R.L.',
      direccion: 'JR. COMANDANTE JUAN GUILLERMO MOORE 296, SAN MIGUEL, LIMA',
      estado: 'ACTIVO',
      condicion: 'HABIDO',
    });
  }

  const token = process.env.APISPERU_TOKEN;
  if (!token) {
    return res.status(500).json({ success: false, error: 'APISPERU_TOKEN no está configurado.' });
  }

  try {
    if (ruc && ruc.length === 11) {
      const resp = await fetch(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`);
      if (resp.ok) {
        const data = await resp.json();
        return res.status(200).json({
          success: true,
          ruc: data.ruc || ruc,
          razonSocial: data.razonSocial || data.nombre || '',
          direccion: data.direccion || data.direccionCompleta || '',
          estado: data.estado || 'ACTIVO',
        });
      }
    }

    if (dni && dni.length === 8) {
      const resp = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`);
      if (resp.ok) {
        const data = await resp.json();
        return res.status(200).json({
          success: true,
          dni: data.dni || dni,
          nombres: `${data.nombres || ''} ${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`.trim(),
        });
      }
    }

    return res.status(404).json({ success: false, error: 'Documento no encontrado o no disponible.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
