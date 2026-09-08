import { AsistenteRecord } from "./adminTypes";

const CSV_HEADERS = [
  "ID",
  "Nombre Completo",
  "Telefono",
  "Correo Electronico",
  "Rango de Edad",
  "Identidad de Genero",
  "Nacio en Monteria",
  "Lugar de Nacimiento",
  "Acompanamiento Infantil",
  "Cantidad Ninos",
  "Comuna",
  "Barrio",
  "Zona",
  "Grupo Poblacional",
  "Grupo Social",
  "Especificacion Grupo Social",
  "Acepto Habeas Data",
  "Acepto Terminos Seccion 16",
  "Fecha de Registro",
];

function wrapCsvValue(value: string | number | boolean | null | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function mapAsistenteToCsvRow(asistente: AsistenteRecord) {
  return [
    asistente.id || "",
    asistente.full_name,
    asistente.phone,
    asistente.email,
    asistente.age_range,
    asistente.gender_identity,
    asistente.born_in_monteria ? "SI" : "NO",
    asistente.birth_location,
    asistente.attended_with_children ? "SI" : "NO",
    asistente.children_count,
    asistente.comuna,
    asistente.barrio,
    asistente.zone,
    asistente.population_group,
    asistente.social_group,
    asistente.other_social_group_spec || "",
    asistente.accepted_habeas_data ? "SI" : "NO",
    asistente.accepted_terms,
    asistente.created_at || "",
  ].map(wrapCsvValue);
}

export function exportAsistentesToCSV(asistentes: AsistenteRecord[]) {
  if (asistentes.length === 0) return;

  const rows = asistentes.map(mapAsistenteToCsvRow);
  const csvContent =
    "\uFEFF" +
    [CSV_HEADERS.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `Reporte_Asistentes_RondaVive_Monteria_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
