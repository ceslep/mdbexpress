import { readFileSync } from "fs";
import express from 'express';
import MDBReader from "mdb-reader";

const BloodCell=process.argv[2];
const app = express();
app.use(express.json());

const buffer = readFileSync(BloodCell);
const reader = new MDBReader(buffer);

 
const items = [
    { key: "WBC", newkey: "WBC", unit: "" },
    { key: "LYMA", newkey: "LYMn", unit: "" },
    { key: "MONA", newkey: "MIDn", unit: "" },
    { key: "GRAA", newkey: "GRAn", unit: "" },
    { key: "LYMP", newkey: "LYMp", unit: "" },
    { key: "MONP", newkey: "MIDp", unit: "" },
    { key: "GRAP", newkey: "GRAp", unit: "" },
    { key: "RBC", newkey: "RBC", unit: "" },
    { key: "HGB", newkey: "HGB", unit: "" },
    { key: "MCHC", newkey: "MCHC", unit: "" },
    { key: "MCH", newkey: "MCH", unit: "" },
    { key: "MCV", newkey: "MCV", unit: "" },
    { key: "RDWCV", newkey: "RDWCV", unit: "" },
    { key: "RDWSD", newkey: "RDWSD", unit: "" },
    { key: "HCT", newkey: "HCT", unit: "" },
    { key: "PLT", newkey: "PLT", unit: "" },
    { key: "MPV", newkey: "MPV", unit: "" },
    { key: "PDW", newkey: "PDW", unit: "" },
    { key: "PCT", newkey: "PCT", unit: "" },
    { key: "PLCR", newkey: "PLCR", unit: "" }
];


const units = [{ key: "WBC", unit: "10^3/uL" }, { key: "RBC", unit: "10^6/uL" }, { key: "HGB", unit: "g/dL" }, { key: "MCHC", unit: "g/dL" }, { key: "HCT", unit: "%" }, { key: "PLT", unit: "10^3/uL" }, { key: "PCT", unit: "%" }];
app.post('/dataHemat', (req, res) => {

    try {
        const { identificacion, fecha } = req.body;
        console.clear();
        const fechahora=new Date();
        console.log(`Importando:${fechahora}`);
        console.log(req.body);
        const table = reader.getTable("Person");
        const data = table.getData();
        const datos = data.filter(dato => dato.TestDate == fecha && dato.SampleNo == identificacion);

        let hdatos = {};
        let refs = datos[0].RefText;
        refs = refs.split(",");
        let idx = 0;
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
                const lvalue = value.replace(/L/g, "");
                const dt = JSON.parse(`{"${items[idx].newkey}":"${lvalue.replace(/-/g, "")} ${unit} Ref. ${refs[idx]}"}`);
                hdatos = { ...hdatos, ...dt };
                idx++;
            }
        });
       
        console.log(hdatos);
        res.json(hdatos);
    } catch (e) {
        res.json({ "e": e });
    }

});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});