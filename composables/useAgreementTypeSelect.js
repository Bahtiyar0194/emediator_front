import { ref, shallowRef, defineAsyncComponent } from "vue";

export function useAgreementTypeSelect({
    treeRef,       // agreementTypes
    modeRef,
    modelRef,      // docData
    errorsRef,     // errors
    modelKey = "agreement_type_id",
}) {
    const selections = ref([]);
    const currentComponent = shallowRef(null);
    const modalProps = ref({});

    // 🔹 Инициализация
    const init = () => {
        currentComponent.value = null;

        if (!Array.isArray(treeRef.value) || !treeRef.value.length) return;

        selections.value = [
            {
                options: treeRef.value,
                selectedId: "",
            },
        ];

        if (modelRef.value[modelKey]) {
            restore();
        }
    };

    // 🔹 Выбор типа
    const onSelect = (levelIndex) => {
        currentComponent.value = null;

        const selectedLevel = selections.value[levelIndex];

        const selectedOption = selectedLevel.options.find(
            (opt) => opt.agreement_type_id === selectedLevel.selectedId
        );

        // удалить уровни ниже
        selections.value.splice(levelIndex + 1);

        if (selectedOption?.childs?.length) {
            modelRef.value[modelKey] = "";
            selections.value.push({
                options: selectedOption.childs,
                selectedId: "",
            });
        } else if (selectedOption?.agreement_type_component) {
            modelRef.value[modelKey] = selectedLevel.selectedId;

            openComponent(selectedOption.agreement_type_component);
        }
    };

    // 🔹 Открытие динамического компонента
    const openComponent = (componentName) => {
        currentComponent.value = defineAsyncComponent(
            () => import(`../components/documents/types/${componentName}.vue`)
        );

        modalProps.value = {
            errors: errorsRef,
            mode: modeRef,
            docData: modelRef,
        };
    };

    // 🔹 Восстановление при редактировании
    const restore = () => {
        const targetId = modelRef.value[modelKey];
        if (!targetId) return;

        const buildPath = (nodes, path = []) => {
            for (const node of nodes) {
                const newPath = [...path, node];

                if (node.agreement_type_id === targetId) {
                    return newPath;
                }

                if (node.childs?.length) {
                    const result = buildPath(node.childs, newPath);
                    if (result) return result;
                }
            }
            return null;
        };

        const path = buildPath(treeRef.value);
        if (!path) return;

        selections.value = [];
        let currentOptions = treeRef.value;

        path.forEach((node) => {
            selections.value.push({
                options: currentOptions,
                selectedId: node.agreement_type_id,
            });

            currentOptions = node.childs || [];
        });

        const last = path[path.length - 1];

        if (last?.agreement_type_component) {
            openComponent(last.agreement_type_component);
        }
    };

    return {
        selections,
        currentComponent,
        modalProps,
        init,
        onSelect,
        restore,
    };
}