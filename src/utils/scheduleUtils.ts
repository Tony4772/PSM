import { DaySchedule, SpecialDateSchedule, StoreConfig } from '../types';

export const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Lunes', isOpen: false, openTime: '16:30', closeTime: '23:30' },
  { dayOfWeek: 2, dayName: 'Martes', isOpen: true, openTime: '16:30', closeTime: '23:30' },
  { dayOfWeek: 3, dayName: 'Miércoles', isOpen: true, openTime: '16:30', closeTime: '23:30' },
  { dayOfWeek: 4, dayName: 'Jueves', isOpen: true, openTime: '16:30', closeTime: '23:30' },
  { dayOfWeek: 5, dayName: 'Viernes', isOpen: true, openTime: '16:30', closeTime: '00:30' },
  { dayOfWeek: 6, dayName: 'Sábado', isOpen: true, openTime: '16:00', closeTime: '00:30' },
  { dayOfWeek: 0, dayName: 'Domingo', isOpen: true, openTime: '16:00', closeTime: '23:30' },
];

export const DEFAULT_SPECIAL_DATES: SpecialDateSchedule[] = [
  {
    id: 'feriado-patrias',
    date: '2026-07-28',
    note: 'Fiestas Patrias (Horario Especial)',
    isClosed: false,
    openTime: '13:00',
    closeTime: '23:30',
  },
  {
    id: 'navidad-descanso',
    date: '2026-12-25',
    note: 'Navidad (Descanso Dark Kitchen)',
    isClosed: true,
  },
];

/**
 * Convierte una hora en formato HH:MM (24h) a formato legible 12h (ej: "16:30" -> "4:30 PM", "00:30" -> "12:30 AM")
 */
export function formatTime12h(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24 || '--:--';
  const parts = time24.split(':');
  const h = parseInt(parts[0], 10);
  const m = parts[1];
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${ampm}`;
}

/**
 * Formatea una fecha YYYY-MM-DD a formato amigable en español
 */
export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Oct',
    'Nov',
    'Dic',
  ];
  return `${days[date.getDay()]} ${day} de ${months[month - 1]}, ${year}`;
}

export interface StoreStatusResult {
  isOpen: boolean;
  statusBadge: string; // 'Abierto Ahora' | 'Cerrado'
  statusDetail: string; // 'Cierra hoy a las 11:30 PM', etc.
  todayScheduleText: string; // 'Hoy (Martes): 4:30 PM - 11:30 PM' o 'Hoy: Cerrado'
  isSpecialDate: boolean;
  specialDateNote?: string;
  nextOpenMessage?: string;
}

/**
 * Evalúa si la tienda está actualmente abierta considerando:
 * 1. Anulación manual (scheduleMode: manual_open / manual_closed)
 * 2. Excepciones por fecha específica (selector de fecha)
 * 3. Horario independiente por día de la semana (selector de hora para cada día)
 * Soporta turnos nocturnos que cierran pasada la medianoche (ej: 16:30 a 00:30).
 */
export function getStoreStatusInfo(
  config: StoreConfig,
  currentDate: Date = new Date()
): StoreStatusResult {
  // 1. Modo manual forzado
  if (config.scheduleMode === 'manual_open') {
    return {
      isOpen: true,
      statusBadge: 'Abierto Ahora',
      statusDetail: 'Abierto (Control manual del dueño activo)',
      todayScheduleText: config.scheduleText || 'Horario extendido',
      isSpecialDate: false,
    };
  }

  if (config.scheduleMode === 'manual_closed') {
    return {
      isOpen: false,
      statusBadge: 'Cerrado',
      statusDetail: 'Cerrado temporalmente por administración',
      todayScheduleText: 'Cerrado temporalmente',
      isSpecialDate: false,
      nextOpenMessage: 'Consulte reapertura por WhatsApp',
    };
  }

  const weekly = config.weeklySchedule && config.weeklySchedule.length === 7
    ? config.weeklySchedule
    : DEFAULT_WEEKLY_SCHEDULE;

  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentDay = String(currentDate.getDate()).padStart(2, '0');
  const todayYMD = `${currentYear}-${currentMonth}-${currentDay}`;
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const currentDayOfWeek = currentDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  // 2. Verificar si hoy es una fecha especial configurada
  const specialDates = config.specialDates || [];
  const todaySpecial = specialDates.find((sd) => sd.date === todayYMD);

  if (todaySpecial) {
    if (todaySpecial.isClosed) {
      return {
        isOpen: false,
        statusBadge: 'Cerrado Hoy',
        statusDetail: `Cerrado por: ${todaySpecial.note}`,
        todayScheduleText: `Cerrado por ${todaySpecial.note}`,
        isSpecialDate: true,
        specialDateNote: todaySpecial.note,
        nextOpenMessage: 'Horario especial programado',
      };
    }

    if (todaySpecial.openTime && todaySpecial.closeTime) {
      const [oH, oM] = todaySpecial.openTime.split(':').map(Number);
      const [cH, cM] = todaySpecial.closeTime.split(':').map(Number);
      const openMin = oH * 60 + oM;
      const closeMin = cH * 60 + cM;

      let isOpenNow = false;
      if (closeMin > openMin) {
        isOpenNow = currentMinutes >= openMin && currentMinutes < closeMin;
      } else {
        // Horario trasnoche (ej: 14:00 a 01:00)
        isOpenNow = currentMinutes >= openMin || currentMinutes < closeMin;
      }

      const todayText = `Hoy (${todaySpecial.note}): ${formatTime12h(todaySpecial.openTime)} - ${formatTime12h(todaySpecial.closeTime)}`;

      if (isOpenNow) {
        return {
          isOpen: true,
          statusBadge: 'Abierto Ahora',
          statusDetail: `Cierra a las ${formatTime12h(todaySpecial.closeTime)} (${todaySpecial.note})`,
          todayScheduleText: todayText,
          isSpecialDate: true,
          specialDateNote: todaySpecial.note,
        };
      } else if (currentMinutes < openMin) {
        return {
          isOpen: false,
          statusBadge: 'Cerrado Actualmente',
          statusDetail: `Abre hoy a las ${formatTime12h(todaySpecial.openTime)} (${todaySpecial.note})`,
          todayScheduleText: todayText,
          isSpecialDate: true,
          specialDateNote: todaySpecial.note,
          nextOpenMessage: `Abre hoy a las ${formatTime12h(todaySpecial.openTime)}`,
        };
      } else {
        return {
          isOpen: false,
          statusBadge: 'Cerrado por Hoy',
          statusDetail: `Horario especial finalizado`,
          todayScheduleText: todayText,
          isSpecialDate: true,
          specialDateNote: todaySpecial.note,
        };
      }
    }
  }

  // 3. Horario regular de la semana
  // Primero chequear si la jornada de ayer continúa abierta pasada la medianoche
  const yesterdayDayOfWeek = (currentDayOfWeek + 6) % 7;
  const yesterdayConfig = weekly.find((d) => d.dayOfWeek === yesterdayDayOfWeek);
  if (yesterdayConfig && yesterdayConfig.isOpen) {
    const [yoH, yoM] = yesterdayConfig.openTime.split(':').map(Number);
    const [ycH, ycM] = yesterdayConfig.closeTime.split(':').map(Number);
    const yOpenMin = yoH * 60 + yoM;
    const yCloseMin = ycH * 60 + ycM;

    // Si ayer cerraba tras medianoche (ej: yCloseMin < yOpenMin) y todavía estamos antes de yCloseMin
    if (yCloseMin < yOpenMin && currentMinutes < yCloseMin) {
      return {
        isOpen: true,
        statusBadge: 'Abierto Ahora',
        statusDetail: `Turno extendido · Cierra a las ${formatTime12h(yesterdayConfig.closeTime)}`,
        todayScheduleText: `Abierto (Turno noche) hasta las ${formatTime12h(yesterdayConfig.closeTime)}`,
        isSpecialDate: false,
      };
    }
  }

  // Ahora chequear la configuración de hoy
  const todayConfig = weekly.find((d) => d.dayOfWeek === currentDayOfWeek);

  if (!todayConfig || !todayConfig.isOpen) {
    // Buscar el próximo día que abra
    let nextMsg = 'Próxima apertura pronto';
    for (let i = 1; i <= 7; i++) {
      const nextDayIdx = (currentDayOfWeek + i) % 7;
      const nextDay = weekly.find((d) => d.dayOfWeek === nextDayIdx);
      if (nextDay && nextDay.isOpen) {
        nextMsg = `Abre el ${nextDay.dayName} a las ${formatTime12h(nextDay.openTime)}`;
        break;
      }
    }

    return {
      isOpen: false,
      statusBadge: 'Cerrado Hoy',
      statusDetail: todayConfig ? `Descanso los ${todayConfig.dayName}` : 'Cerrado hoy',
      todayScheduleText: todayConfig ? `Hoy (${todayConfig.dayName}): Cerrado` : 'Cerrado',
      isSpecialDate: false,
      nextOpenMessage: nextMsg,
    };
  }

  const [oH, oM] = todayConfig.openTime.split(':').map(Number);
  const [cH, cM] = todayConfig.closeTime.split(':').map(Number);
  const openMin = oH * 60 + oM;
  const closeMin = cH * 60 + cM;

  const todayScheduleFormatted = `Hoy (${todayConfig.dayName}): ${formatTime12h(todayConfig.openTime)} - ${formatTime12h(todayConfig.closeTime)}`;

  let isOpenNow = false;
  if (closeMin > openMin) {
    isOpenNow = currentMinutes >= openMin && currentMinutes < closeMin;
  } else {
    // Trasnocha después de medianoche (ej: 16:30 a 00:30)
    isOpenNow = currentMinutes >= openMin || currentMinutes < closeMin;
  }

  if (isOpenNow) {
    return {
      isOpen: true,
      statusBadge: 'Abierto Ahora',
      statusDetail: `Cierra a las ${formatTime12h(todayConfig.closeTime)}`,
      todayScheduleText: todayScheduleFormatted,
      isSpecialDate: false,
    };
  } else if (currentMinutes < openMin) {
    return {
      isOpen: false,
      statusBadge: 'Cerrado Actualmente',
      statusDetail: `Abre hoy a las ${formatTime12h(todayConfig.openTime)}`,
      todayScheduleText: todayScheduleFormatted,
      isSpecialDate: false,
      nextOpenMessage: `Abre hoy a las ${formatTime12h(todayConfig.openTime)}`,
    };
  } else {
    // Ya cerró hoy, buscar cuándo abre mañana
    const tomorrowIdx = (currentDayOfWeek + 1) % 7;
    const tomorrowConfig = weekly.find((d) => d.dayOfWeek === tomorrowIdx);
    const tomorrowMsg = tomorrowConfig && tomorrowConfig.isOpen
      ? `Abre mañana ${tomorrowConfig.dayName} a las ${formatTime12h(tomorrowConfig.openTime)}`
      : 'Cerrado por hoy';

    return {
      isOpen: false,
      statusBadge: 'Cerrado por Hoy',
      statusDetail: tomorrowMsg,
      todayScheduleText: todayScheduleFormatted,
      isSpecialDate: false,
      nextOpenMessage: tomorrowMsg,
    };
  }
}

/**
 * Genera un texto resumen conciso a partir de la lista semanal de 7 días.
 */
export function generateScheduleSummaryText(weeklySchedule: DaySchedule[]): string {
  if (!weeklySchedule || weeklySchedule.length === 0) {
    return 'Mar a Dom: 4:30 PM - 11:30 PM';
  }

  // Ordenar de Lunes (1) a Domingo (0)
  const sorted = [...weeklySchedule].sort((a, b) => {
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return orderA - orderB;
  });

  const openDays = sorted.filter((d) => d.isOpen);
  const closedDays = sorted.filter((d) => !d.isOpen);

  if (openDays.length === 0) {
    return 'Cerrado temporalmente';
  }

  // Agrupar días consecutivos con el mismo horario
  const groups: { days: string[]; time: string }[] = [];
  openDays.forEach((d) => {
    const timeStr = `${formatTime12h(d.openTime)} - ${formatTime12h(d.closeTime)}`;
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.time === timeStr) {
      lastGroup.days.push(d.dayName);
    } else {
      groups.push({ days: [d.dayName], time: timeStr });
    }
  });

  const formattedGroups = groups.map((g) => {
    let dayStr = '';
    if (g.days.length === 1) {
      dayStr = g.days[0];
    } else if (g.days.length === 2) {
      dayStr = `${g.days[0].slice(0, 3)} y ${g.days[1].slice(0, 3)}`;
    } else {
      dayStr = `${g.days[0].slice(0, 3)} a ${g.days[g.days.length - 1].slice(0, 3)}`;
    }
    return `${dayStr}: ${g.time}`;
  });

  if (closedDays.length > 0 && closedDays.length <= 2) {
    const closedStr = closedDays.map((d) => d.dayName.slice(0, 3)).join(', ');
    formattedGroups.push(`${closedStr}: Cerrado`);
  }

  return formattedGroups.join(' · ');
}
