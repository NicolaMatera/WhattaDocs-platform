import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Questi sono i "permessi" che diamo al tuo browser
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestione della richiesta "preflight" (il controllo di sicurezza del browser)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Recuperiamo l'URL che hai inviato da React
    const { url } = await req.json()
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL mancante' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // IL CUORE DEL PROXY:
    // Il server di Supabase scarica il file per te
    const response = await fetch(url)
    const blob = await response.blob()

    // Rispediamo il file al tuo React aggiungendo i permessi CORS
    return new Response(blob, {
      headers: { 
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream'
      },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})