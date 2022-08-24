import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function dataFormat(date: string): string {
  return format(new Date(date), 'PP', { locale: ptBR });
}
