import { makeObjectRouter } from "./genericObject.routes";
// contacts: kayıtlı olmayan kişi isimlerinin düz listesi

export default makeObjectRouter<string[]>("contacts");
