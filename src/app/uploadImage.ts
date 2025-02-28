import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus datos de Supabase
const SUPABASE_URL = 'https://wawyxuzsewurcvaryomf.supabase.co/storage/v1/s3';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd3l4dXpzZXd1cmN2YXJ5b21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjA5NDAsImV4cCI6MjA1NjMzNjk0MH0.7Q0iFVXAV7BcstWOuGUfIGFU95q5zAxb2y3PM3k3VjE';

// Inicializa el cliente
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function uploadImage(file: File): Promise<string | null> {
  // Genera un path único para el archivo
  const filePath = `imagenes/${Date.now()}-${file.name}`;

  // Sube el archivo al bucket especificado
  const { data, error } = await supabase.storage
    .from('tu-bucket') // Reemplaza 'tu-bucket' por el nombre de tu bucket en Supabase
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error al subir la imagen:', error.message);
    return null;
  }

  // Obtén la URL pública del archivo subido
  const { publicURL, error: urlError } = supabase.storage
    .from('tu-bucket')
    .getPublicUrl(filePath);

  if (urlError) {
    console.error('Error al obtener la URL pública:', urlError.message);
    return null;
  }

  return publicURL;
}
