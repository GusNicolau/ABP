export var single = [
  {
    "name": "Piernas",
    "value": 278 // Representa aproximadamente el 28% del total
  },
  {
    "name": "Brazos",
    "value": 195 // Representa aproximadamente el 20% del total
  },
  {
    "name": "Abdomen",
    "value": 123 // Representa aproximadamente el 12% del total
  },
  {
    "name": "Pecho",
    "value": 264 // Representa aproximadamente el 27% del total
  },
  {
    "name": "Espalda",
    "value": 140 // Representa aproximadamente el 14% del total
  }
];
const total = single.reduce((acc, curr) => acc + curr.value, 0);

// Modifica los datos para incluir el porcentaje en el nombre
single = single.map(item => ({
    name: `${item.name} (${((item.value / total) * 100).toFixed(2)}%)`,
    value: item.value
}));
