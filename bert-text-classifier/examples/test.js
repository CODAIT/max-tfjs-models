const tc = require("../dist/src/max.sentimentclass.cjs.js");
tc.predict("i like strawberries").then(res=>console.log(res));
tc.encode("i like strawberries").then(res=>console.log(res));
