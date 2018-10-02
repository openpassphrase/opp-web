import { Injectable } from '@angular/core';
import { CdkExpandableInputComponent } from './expandable-input.component';

@Injectable()
export class InputsManagerService {
  private groups: { [key: string]: CdkExpandableInputComponent[] } = {};

  registerComponent(cmp: CdkExpandableInputComponent) {
    if (cmp.group) {
      if (!this.groups[cmp.group]) {
        this.groups[cmp.group] = [];
      }
      this.groups[cmp.group].push(cmp);
    }
  }

  deregisterComponent(cmp: CdkExpandableInputComponent) {
    if (cmp.group) {
      const ix = this.groups[cmp.group].findIndex(c => c === cmp);
      if (ix > -1) {
        this.groups[cmp.group].splice(ix, 1);
      }
    }
  }

  onOpen(cmp: CdkExpandableInputComponent) {
    if (cmp.group) {
      this.groups[cmp.group].forEach(c => {
        if (c !== cmp && c.isOpen) {
          c.close();
        }
      });
    }
  }
}
