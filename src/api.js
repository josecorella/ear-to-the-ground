// API Controller File that failed to work in time, I will be leaving this here
// for future use
const APIController = (function () {
  const clientId = "a8ac329c73af4689ac2bf6db3168464c";
  const clientSecret = "";

  // For insight on why these functions are made this way take a look here
  // https://developer.spotify.com/documentation/web-api/reference/

  // private methods
  // gets session token from spotify
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  // searches artist name so we can have access to their artist id which is needed
  // in to get the related artists
  const _search = async (token, name) => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${name.replace(
        " ",
        "%20"
      )}&type=artist`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await result.json();
    return data.artists;
  };

  // gets related artsists from an artist id
  const _getRelatedArtists = async (token, id) => {
    const result = await fetch(
      `https://api.spotify.com/v1/artists/${id}/related-artists`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await result.json();
    return data.artists;
  };

  // returns public access to the functions we jsut created
  return {
    getToken() {
      return _getToken();
    },
    search(name) {
      return _search(token, name);
    },
    getRelatedArtists(token, name) {
      return _getRelatedArtists(token, name);
    },
  };
})();
