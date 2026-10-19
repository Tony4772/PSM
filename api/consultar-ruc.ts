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

  const token =
    process.env.APISPERU_TOKEN ||
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6Ikpvc2VBbnRvbmlvIiwiY29tcGFueSI6IjIwNjE0MTIxMDQyIiwiaWF0IjoxNzgwOTQzMDMyLCJleHAiOjgwODgxNDMwMzJ9.dEQToGeW0_1-7UHvHw9QZjPkwWPk24DG0eMwVliefJ3cCSf4Jh3UrHErQ5AbCLtfJNqA4fMI4nHmsaUlJMochpFgO2lcFkp3F-WDcOOEjh2ICcM0Zt7LgYbFk5A5TbGvr63AltMtnkENetZCjuHkWn9H11zaqhXGhKZ_u4BP_UqVUpR0LrVF1MuLunp7e_N3SC6Ts2QUwzSm28TJoVlGPg9IiQPTaLBDKAkt7YHTYZVtCrqr35mV5SAWga00u7uxdBZccC0VA5YxgB8SMfB1mxvzQQkN36XvtgB6RCNb_t7X-2qRjG-QtJZpOxhfse3VzH28WgJQLsN2KVHiEvL5-kcal2Y4Oj2JTAOIzV8LtDUC0XFz5yZ02s_bgIQkEWp84S7jbxjaeIvneoL-Ur7XnrMue8FG7r0HU4osb6bjQJSRnJuiInoK6QwXpn1UH3VhpmJx1GQNdCeRlStVpgZqYpmV-ycwrgiuXT17-YrgZ5974lSzqB4m2qhpSOp7koxpUnCrjHYfsqqiEb6B_Ovywk7DVUBDfuZG5aOyN00C_cbyIJYL1WHEYn1CZVBu505EWRooNRRkJDzx4uETE8JTz0P1gOY4XhUHsyRN7n-kfZesWOKpBlHiSPvzTfOtJfvSN3bg7YnNnWJ9WtZgafX_oALTb0PEcNWU4_LtAGmiwlI';

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
