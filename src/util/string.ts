export default class StringUtil {
    public elipisis(str: string, length?: number): string {
        length = length || 2000;
        return str.length > length? `${str.substr(0, length - 3)}`: str;
    }

    public uppercase(text: string, split?: string): string {
        split = split || ' ';
        return text.split(split).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join(' ');
    }
}