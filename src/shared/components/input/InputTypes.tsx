
export class InputTypes {
    static Phone = new RegExp('1?\\W*([2-9][0-8][0-9])\\W*([2-9][0-9]{2})\\W*([0-9]{4})(\\se?x?t?(\\d*))?');
    static Email = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
    static Zip = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');
    static Number = new RegExp('^\\d*$')
}
