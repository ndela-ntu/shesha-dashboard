export default async function fetchCurrentLocation(): Promise<{
    location: { latitude: number; longitude: number } | null;
    error: string | null;
  }> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              error: null,
            });
          },
          (err) => {
            let errorMessage: string;
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMessage = "User denied the request for Geolocation.";
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
              case err.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
              default:
                errorMessage = "An unknown error occurred.";
                break;
            }
            resolve({ location: null, error: errorMessage });
          }
        );
      } else {
        resolve({
          location: null,
          error: "Geolocation is not supported by this browser.",
        });
      }
    });
  }
  