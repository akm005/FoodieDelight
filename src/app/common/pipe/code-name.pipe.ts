import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codeToName',
})
export class CodeToNamePipe implements PipeTransform {
  // The types array with mappings
  types = [
    { name: 'VEG', code: 'VEG' },
    { name: 'NONVEG', code: 'NVEG' },
    { name: 'VEG+NONVEG', code: 'VEGNV' },
    { name: 'VEGAN', code: 'VG' },
    { name: 'JAIN', code: 'JN' },
  ];

  // The transform method that takes a code and returns the corresponding name
  transform(code: string): string {
    const type = this.types.find((t) => t.code === code);
    return type ? type.name : code; // Return the name if found, otherwise return the code itself
  }
}
