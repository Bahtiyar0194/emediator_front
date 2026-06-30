import { ref, computed } from 'vue';

export function useFormattedAmount(initialValue = "") {
    // Внутреннее "чистое" состояние без пробелов
    const rawValue = ref(initialValue);

    // Вычисляемое свойство для v-model в инпуте
    const formattedValue = computed({
        get() {
            if (!rawValue.value) return "";
            // Превращаем в строку (на случай, если придет число) и делим на триады
            return String(rawValue.value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },
        set(newValue) {
            const cleanString = newValue.replace(/\s+/g, "");
            // Если строка пустая, пишем 0 (или ""), иначе приводим к числу
            rawValue.value = cleanString === "" ? "" : Number(cleanString);
        }
    });

    // Возвращаем и чистую реактивную переменную, и форматированную
    return {
        rawValue,
        formattedValue
    };
}