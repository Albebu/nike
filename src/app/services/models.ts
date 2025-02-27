export interface Product {
  reference: string;
  name: string;
  price: number;
  description?: string;
  category: CATEGORIES;
  sale?: boolean;
  image?: string;
}

export enum CATEGORIES {
  DAILY = 'Zapatillas para el día a día',
  JORDAN = 'Zapatillas Jordan',
  RUNNING = 'Zapatillas de running',
  FUTBOL = 'Zapatillas de fútbol',
  BASKETBALL = 'Zapatillas de baloncesto',
  GYM = 'Zapatillas para gym y training',
  SKATE = 'Zapatillas de skateboard',
}
