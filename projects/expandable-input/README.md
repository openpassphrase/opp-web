# Expandable Input - CDK

## What is it?
A component consisting of a trigger element (button/icon/anything else...) and an input which shows by sliding to the left when the button is clicked.

Both, the trigger element and the input need to be supplied allowing a lot of flexibility. This library strives to make as little assumptions about styling as possible. It is then very simple to use this as a base for 

Optionally you can also pass an "action trigger" element, which is useful when you'd like the user to be able to submit the value via a button.

## What does it look like?
Code:
```html
<cdk-expandable-input>
  <input type="text" cdkExpInput />
  <i cdkExpIconOpen>🔍</i>
  <i cdkExpIconClose>✖️</i>
</cdk-expandable-input>

<br />

<cdk-expandable-input>
  <input type="text" cdkExpInput />
  <i cdkExpIconOpen>➕</i>
  <i cdkExpIconClose>✖️</i>
  <i cdkExpIconAction>➕</i>
</cdk-expandable-input>
```
Result:

![Result](https://i.imgur.com/9Giozh5.gif)

## Usage
1. Add module your your imports:
```ts
import { ExpandableInputModule } from 'expandable-input';

@NgModule({
  imports: [
    ExpandableInputModule
  ]
  ...
})
export class AppModule { }
```

2. Add component to your template like shown above.

## API

### **Directives**
Directive | Selector | Description
--- | --- | ---
CdkExpInputDirective | cdkExpInput | Required. placed on `<input />` the element or an element containing `<input />` 
CdkExpIconOpenDirective | cdkExpIconOpen | Required. Placed on element that will trigger opening. Usually an icon or a button.
CdkExpIconCloseDirective | cdkExpIconClose | Required. Placed on element that will trigger closing. Usually an icon or a button.
CdkExpIconActionDirective | cdkExpIconAction | Optional. Placed on element that will serve functionality of submitting input value. Usually an icon or a button that looks the same as open icon.

### **cdk-expandable-input**
### Inputs:
Input | Description
--- | ---
@Input() isAbsolute = false; | Sets position of the host element to `absolute`. Useful when you'd like the input to cover any other elements located on the same eyeline of the component. When set to `true`, it will log a warning to the console if the host does not have a solid background set.
@Input() right = 0; | Used when `[isAbsolute]="true"`. Sets amount of pixels from the right edge of a container. Useful when there is another element located to the right of this expandable input.
@Input() slideToEdge = false; | Used when `[right]="is greater than 0"`. Animates component to take the whole container's width when extending
@Input() group: string | If multiple components use the same value for "group" input, only one component with that group value can be expanded at a time
@Input() actionOffset = 5; | Sets how far to the left from the open/close elements the action element is.
@Input() blurInputOnEsc = false; | When true, input looses focus if Esc is pressed
@Input() openOnKey: string | undefined; | When set to KeyboardEvent.key, input will expand when that key is pressed

### Outputs:
Output | Description
--- | ---
@Output() opened | Emitted when input expanded
@Output() closed | Emitted when input collapsed

## Example of using isAbsolute, right, and slideToEdge:
```html
<div style="position: relative">
  <cdk-expandable-input [isAbsolute]="true" [right]="30" [slideToEdge]="true" style="background: white;">
    <input type="text" cdkExpInput />
    <i cdkExpIconOpen>🔍</i>
    <i cdkExpIconClose>✖️</i>
  </cdk-expandable-input>
  
  <br />

  <cdk-expandable-input [isAbsolute]="true" style="background: white;">
    <input type="text" cdkExpInput />
    <i cdkExpIconOpen>➕</i>
    <i cdkExpIconClose>✖️</i>
    <i cdkExpIconAction>➕</i>
  </cdk-expandable-input>
</div>
```
Result:

![Result](https://i.imgur.com/tEB6YVk.gif)
