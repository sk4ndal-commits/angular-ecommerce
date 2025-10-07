import {FormControl, ValidationErrors} from "@angular/forms";

export class Luv2ShopValidators {

  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    // @ts-ignore
    return (control.value != null) && (control.value.trim().length === 0)
    ? {'notOnlyWhitespace': true}
    : null;
  }
}
