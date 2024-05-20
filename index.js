import { readFileSync } from "fs";
import express from 'express';
import MDBReader from "mdb-reader";

const BloodCell=process.argv[2];
const app = express();
app.use(express.json());

const buffer = readFileSync(BloodCell);
const reader = new MDBReader(buffer);

 
const items = [
    { key: "WBC", newkey: "WBC", unit: "",ref:"4.5-11" },
    { key: "LYMA", newkey: "LYMn", unit: "",ref:"0" },
    { key: "MONA", newkey: "MIDn", unit: "",ref:"0" },
    { key: "GRAA", newkey: "GRAn", unit: "",ref:"0" },
    { key: "LYMP", newkey: "LYMp", unit: "",ref:"20-40" },
    { key: "MONP", newkey: "MIDp", unit: "",ref:"2-9" },
    { key: "GRAP", newkey: "GRAp", unit: "",ref:"21.1-65" },
    { key: "RBC", newkey: "RBC", unit: "",ref:"4.2-5.5" },
    { key: "HGB", newkey: "HGB", unit: "",ref:"12-17" },
    { key: "MCHC", newkey: "MCHC", unit: "" ,ref:"32-36"},
    { key: "MCH", newkey: "MCH", unit: "",ref:"28-32" },
    { key: "MCV", newkey: "MCV", unit: "",ref:"80-100" },
    { key: "RDWCV", newkey: "RDWCV", unit: "" ,ref:"10-14"},
    { key: "RDWSD", newkey: "RDWSD", unit: "",ref:"0" },
    { key: "HCT", newkey: "HCT", unit: "",ref:"36-50" },
    { key: "PLT", newkey: "PLT", unit: "",ref:"150-450" },
    { key: "MPV", newkey: "MPV", unit: "",ref:"0" },
    { key: "PDW", newkey: "PDW", unit: "",ref:"0" },
    { key: "PCT", newkey: "PCT", unit: "",ref:"0" },
    { key: "PLCR", newkey: "PLCR", unit: "",ref:"0" }
];


const units = [{ key: "WBC", unit: "10^3/uL" }, { key: "RBC", unit: "10^6/uL" }, { key: "HGB", unit: "g/dL" }, { key: "MCHC", unit: "g/dL" }, { key: "HCT", unit: "%" }, { key: "PLT", unit: "10^3/uL" }, { key: "PCT", unit: "%" },{key:"LYMP",unit:"%"},{key:"MONP",unit:"%"},{key:"GRAP",unit:"%"},{key:"MONP",unit:"%"},{key:"MCH",unit:"pg"},{key:"RDWCV",unit:"%"}];


const getData = (identificacion,fecha)=>{
try {
       
        console.clear();
        const fechahora=new Date();
        console.log(`Importando:${fechahora}`);
        
        const table = reader.getTable("Person");
        const data = table.getData();
        const datos = data.filter(dato => dato.TestDate == fecha && dato.SampleNo == identificacion);
        console.log(datos);    
        let hdatos = {};
        let refs = datos[0].RefText;
	refs=items.map(i=>i.ref);
       // refs = refs.split(",");
        let idx = 0;
	const keysSi=items.filter(i=>i.ref!="0");
	//console.log(keysSi);
        Object.keys(datos[0]).forEach((key, index, array) => {

            let idx = items.findIndex((item) => item.key === key);
            let unit = "";
            let idu = 0;
            if (idx >= 0) {

                idu = units.findIndex((unit) => unit.key == items[idx].key);
                if (idu >= 0) unit = units[idu].unit;
            }
            if (idx >= 0) {
		
                const value = datos[0][key];
                const lvalue = value.replace(/L/g, "").replace(/H/g, "");
		let dt;
		if(keysSi.findIndex(k=>k.key==key)>=0){
                 dt = JSON.parse(`{"${items[idx].newkey}":"${lvalue.replace(/-/g, "")} ${unit} Ref. ${refs[idx]} ${unit}"}`);
		} else{
		dt=JSON.parse(`{"${items[idx].newkey}":""}`);	

}

                hdatos = { ...hdatos, ...dt };
              
                idx++;
            }
        });
       
        return hdatos;
    } catch (e) {
        console.log(e)
    }
}

app.post('/dataHemat', (req, res) => {
    const { identificacion, fecha } = req.body;
    console.log(req.body);
    const datos=getData(identificacion,fecha);
    console.log(datos);
    res.json(datos);

});

//console.log(getData("75039536","2024-05-15"));

app.listen(3000, () => {
    console.log('Server listening on port 3000 hmt');
});