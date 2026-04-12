import { ref } from "vue";

export function useLocationSelect({
    treeRef,          // locations
    modelRef,         // docData
}) {
    const selections = ref([]);

    // 🔹 Инициализация первого уровня
    const init = () => {
        const tree = treeRef.value;
        if (!Array.isArray(tree) || !tree.length) return;

        selections.value = [
            {
                options: tree[0].childs || [],
                selectedId: "",
            },
        ];

        if (modelRef.value) {
            restore();
        }
    };

    // 🔹 Выбор значения
    const onSelect = (levelIndex) => {
        const selectedLevel = selections.value[levelIndex];

        const selectedOption = selectedLevel.options.find(
            (opt) => opt.location_id === selectedLevel.selectedId
        );

        // Удаляем уровни ниже
        selections.value.splice(levelIndex + 1);

        if (selectedOption?.childs?.length) {
            selections.value.push({
                options: selectedOption.childs,
                selectedId: "",
            });

            modelRef.value = "";
        } else {
            modelRef.value = selectedLevel.selectedId;
        }
    };

    // 🔹 Восстановление при редактировании
    const restore = () => {
        const targetId = modelRef.value;
        if (!targetId) return;

        const buildPath = (nodes, path = []) => {
            for (const node of nodes) {
                const newPath = [...path, node];

                if (node.location_id === targetId) {
                    return newPath;
                }

                if (node.childs?.length) {
                    const result = buildPath(node.childs, newPath);
                    if (result) return result;
                }
            }
            return null;
        };

        const root = treeRef.value?.[0]?.childs || [];
        const path = buildPath(root);
        if (!path) return;

        selections.value = [];
        let currentOptions = root;

        path.forEach((node) => {
            selections.value.push({
                options: currentOptions,
                selectedId: node.location_id,
            });

            currentOptions = node.childs || [];
        });
    };

    return {
        selections,
        init,
        onSelect,
        restore,
    };
}
