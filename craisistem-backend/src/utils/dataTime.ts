export const getElSalvadorDateObject = (): Date => {
  const ahora = new Date();
  
  const opciones = { 
    timeZone: "America/El_Salvador", 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: false 
  } as const;
  
  const formateador = new Intl.DateTimeFormat("en-US", opciones);
  const partes = formateador.formatToParts(ahora);
  const year = partes.find(p => p.type === "year")?.value;
  const month = partes.find(p => p.type === "month")?.value;
  const day = partes.find(p => p.type === "day")?.value;
  const hour = partes.find(p => p.type === "hour")?.value;
  const minute = partes.find(p => p.type === "minute")?.value;
  const second = partes.find(p => p.type === "second")?.value;

  return new Date(
    Number(year), 
    Number(month) - 1, 
    Number(day), 
    Number(hour), 
    Number(minute), 
    Number(second)
  );
};

export const getElSalvadorTime = (): string => {
  const formatter = new Intl.DateTimeFormat("es-SV", {
    timeZone: "America/El_Salvador",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, 
  });
  
  return formatter.format(new Date()); 
};