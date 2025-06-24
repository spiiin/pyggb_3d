import { AppApi } from "../../shared/appApi";
import { augmentedGgbApi, assembledCommand, AugmentedGgbApi } from "../shared";
import { SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  // Создаем константы для осей
  const xAxis = new Sk.builtin.str("xAxis");
  const yAxis = new Sk.builtin.str("yAxis");
  const zAxis = new Sk.builtin.str("zAxis");

  // Добавляем константы в модуль
  mod.xAxis = xAxis;
  mod.yAxis = yAxis;
  mod.zAxis = zAxis;

  const fun = new Sk.builtin.func((...args) => {
    const badArgsError = new Sk.builtin.TypeError(
      "Rotate() arguments must be" +
        " (object, angle)" +
        " or (object, angle, rotation_center_point)" +
        " or (object, angle, axis_of_rotation)" +
        " or (object, angle, point_on_axis, axis_direction_or_plane)"
    );

    const ggbRotate = (extraArgs: Array<string>) => {
      if (!ggb.isGgbObject(args[0])) {
        throw badArgsError;
      }

      const pyAngle = args[1];
      ggb.throwIfNotPyOrGgbNumber(pyAngle, "rotation angle");
      const angleArg = ggb.numberValueOrLabel(pyAngle);

      const ggbArgs = [args[0].$ggbLabel, angleArg, ...extraArgs];
      const ggbCmd = assembledCommand("Rotate", ggbArgs);
      const label = ggb.evalCmd(ggbCmd);
      return ggb.wrapExistingGgbObject(label);
    };

    switch (args.length) {
      case 2: {
        // Rotate(object, angle) - вращение вокруг начала координат
        return ggbRotate([]);
      }
      case 3: {
        // Проверяем, что это точка или ось
        if (ggb.isGgbObjectOfType(args[2], "point")) {
          // Rotate(object, angle, point) - вращение вокруг точки
          return ggbRotate([args[2].$ggbLabel]);
        } else if (Sk.builtin.checkString(args[2])) {
          // Rotate(object, angle, axis) - вращение вокруг оси
          const axisStr = args[2].v;
          if (axisStr === "xAxis" || axisStr === "yAxis" || axisStr === "zAxis") {
            return ggbRotate([axisStr]);
          } else {
            throw new Sk.builtin.TypeError(
              "Axis of rotation must be xAxis, yAxis, or zAxis"
            );
          }
        } else {
          throw badArgsError;
        }
      }
      case 4: {
        // Rotate(object, angle, point_on_axis, axis_direction_or_plane)
        if (!ggb.isGgbObjectOfType(args[2], "point")) {
          throw new Sk.builtin.TypeError(
            "Third argument must be a point on the axis"
          );
        }
        
        // Четвертый аргумент может быть вектором (направление оси) или плоскостью
        if (ggb.isGgbObjectOfType(args[3], "vector")) {
          // Направление оси - вектор
          return ggbRotate([args[2].$ggbLabel, args[3].$ggbLabel]);
        } else if (ggb.isGgbObjectOfType(args[3], "plane")) {
          // Плоскость
          return ggbRotate([args[2].$ggbLabel, args[3].$ggbLabel]);
        } else {
          throw new Sk.builtin.TypeError(
            "Fourth argument must be a vector (axis direction) or a plane"
          );
        }
      }
      default:
        throw badArgsError;
    }
  });

  mod.Rotate = fun;
};
