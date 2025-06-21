import { AppApi } from "../../shared/appApi";
import { AugmentedGgbApi, augmentedGgbApi } from "../shared";
import { SkulptApi, SkString } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);

  const fun = new Sk.builtin.func((...args) => {
    if (args.length !== 1)
      throw new Sk.builtin.TypeError("deleteObject() takes exactly 1 argument");
    
    if (!(args[0] instanceof Sk.builtin.str))
      throw new Sk.builtin.TypeError("deleteObject() argument must be a string");
    
    const objectName = (args[0] as SkString).v;
    
    // Удаляем объект через JS-метод
    appApi.ggb.deleteObject(objectName);
    
    return Sk.builtin.none.none$;
  });

  mod.deleteObject = fun;
}; 