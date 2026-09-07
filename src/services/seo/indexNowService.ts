export const INDEXNOW_KEY = 'bdad9c2d9197485ebd55da199d97309c';
export const INDEXNOW_HOST = 'mediaconvert.online';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

export interface IndexNowResponse {
  success: boolean;
  status: number;
  message: string;
}

/**
 * Submits one or multiple URLs to the IndexNow API (Bing, MSN, Yandex, etc.)
 */
export async function submitToIndexNow(urlList: string | string[]): Promise<IndexNowResponse> {
  const urls = Array.isArray(urlList) ? urlList : [urlList];

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls
  };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      return {
        success: true,
        status: response.status,
        message: 'URLs enviadas con éxito a IndexNow (Bing / MSN).'
      };
    }

    return {
      success: false,
      status: response.status,
      message: `Error al enviar a IndexNow: Código ${response.status} (${response.statusText})`
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: `Error de conexión con IndexNow: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
