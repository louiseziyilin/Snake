// //@ts-ignore Import module
// import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// //@ts-ignore Import module
// import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { firebaseConfig } from "./config.js";

// class FirebaseClient {
//   private static _instance: FirebaseClient;
//   private app = initializeApp (firebaseConfig);
//   private _db = getDatabase(this.app);

//   private constructor () {}

//   public static get instance(): FirebaseClient{
//     if(!FirebaseClient._instance){
//       FirebaseClient._instance = new FirebaseClient ();
//     }

//     return FirebaseClient._instance;
//   }

//   public get db (){
//     return this._db;
//   }
// }

// export { FirebaseClient };

import { firebaseConfig } from "./config.js";
//@ts-ignore Import module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
//@ts-ignore Import
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

class FirebaseClient {
  private static _instance: FirebaseClient;
  private app = initializeApp(firebaseConfig);
  private _db = getDatabase(this.app);

  private constructor() {}

  public static get instance(): FirebaseClient {
    if (!FirebaseClient._instance) {
      FirebaseClient._instance = new FirebaseClient();
    }

    return FirebaseClient._instance;
  }

  public get db() {
    return this._db;
  }
}

export { FirebaseClient };