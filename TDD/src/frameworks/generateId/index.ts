import {v4 as uuidv4} from 'uuid';
let myuuid = uuidv4();

function generateId() {
    return myuuid
}
export default generateId;