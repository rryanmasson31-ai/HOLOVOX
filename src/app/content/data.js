import { jwtDecode } from "jwt-decode";

export const getTokenData= async()=>{
const token = localStorage.getItem("token")
// if(!token){
//   showErrorToast('you are not authorized person')
// }
const decodedToken = await jwtDecode(token);
console.log("Decoded Token Data:", decodedToken);
return decodedToken;
}
