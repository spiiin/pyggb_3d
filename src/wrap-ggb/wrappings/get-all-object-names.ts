import { AppApi } from "../../shared/appApi";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import { SkulptApi, SkString } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    if (args.length > 1)
      throw new Sk.builtin.TypeError("getAllObjectNames() takes at most 1 argument");
    
    let typeFilter: string | undefined;
    
    if (args.length === 1) {
      if (!(args[0] instanceof Sk.builtin.str))
        throw new Sk.builtin.TypeError("getAllObjectNames() type parameter must be a string");
      typeFilter = (args[0] as SkString).v;
    }
    
    // Получаем все имена объектов через JS-метод
    let objectNames: string[] = appApi.ggb.getAllObjectNames();

    // Фильтрация по типу, если задано
    if (typeFilter !== undefined) {
      const filterValue = typeFilter; // локальная переменная, точно string
      objectNames = objectNames.filter(name => {
        try {
          const objectType = appApi.ggb.getObjectType(name);
          return objectType.toLowerCase() === filterValue.toLowerCase();
        } catch (e) {
          return false;
        }
      });
    }

    // Преобразуем в Python-список
    const pythonList = objectNames.map((name: string) => new Sk.builtin.str(name));
    return new Sk.builtin.list(pythonList);
  });

  mod.getAllObjectNames = fun;
}; 