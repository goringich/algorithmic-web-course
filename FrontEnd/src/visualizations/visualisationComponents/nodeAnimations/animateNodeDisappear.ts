import Konva from "konva";

export const animateNodeDisappear = (
  nodeKey: number,
  shapeOrMapping: Record<number, Konva.Circle> | Konva.Circle
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let shape: Konva.Circle | undefined;

    if (
      shapeOrMapping &&
      typeof shapeOrMapping === "object" &&
      !("to" in shapeOrMapping)
    ) {
      console.log(
        `[DEBUG] animateNodeDisappear: Ищем фигуру с key ${nodeKey} в словаре shapeRefs`
      );
      shape = (shapeOrMapping as Record<number, Konva.Circle>)[nodeKey];
    } else if (shapeOrMapping && "to" in shapeOrMapping) {
      console.log(
        `[DEBUG] animateNodeDisappear: Получена прямая фигура, будем её анимировать`
      );
      shape = shapeOrMapping as Konva.Circle;
    }

    if (!shape) {
      console.warn(
        `[WARN] Фигура для key ${nodeKey} не найдена, пропускаем анимацию.`
      );
      return resolve();
    }

    console.log(
      `[INFO] animateNodeDisappear: Запуск анимации для фигуры с key ${nodeKey}`
    );

    shape.to({
      opacity: 0,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        console.log(
          `[INFO] animateNodeDisappear: Анимация завершена, удаляем фигуру с key ${nodeKey}`
        );
        shape.remove();
        if (
          shapeOrMapping &&
          typeof shapeOrMapping === "object" &&
          !("to" in shapeOrMapping)
        ) {
          delete (shapeOrMapping as Record<number, Konva.Circle>)[nodeKey];
        }
        console.log(
          `[DEBUG] animateNodeDisappear: Фигура с key ${nodeKey} удалена.`
        );
        resolve();
      }
    });
  });
};
