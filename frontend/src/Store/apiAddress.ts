function getAddress(isDemo = true) : string {
    return isDemo ? "http://127.0.0.1:8000" : "https://digital-library.hopto.org/api";
}


export default getAddress();
