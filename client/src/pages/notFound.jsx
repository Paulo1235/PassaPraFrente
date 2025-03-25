import React, { useEffect, useState } from "react";

const NotFound = () => {
  const [url, setURL] = useState("");

  useEffect(() => {
    setURL("https://http.cat/404");
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-bgp">
      {url && <img src={url} alt="Error 404" />}
    </div>
  );
};

export default NotFound;
