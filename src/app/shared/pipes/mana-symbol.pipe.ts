import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';

const COLOR_MAP: Record<string, string> = {
  W: '#f9faf4',
  U: '#0e68ab',
  B: '#150b00',
  R: '#d3202a',
  G: '#00733e',
  C: '#c1c1c1',
};

@Pipe({ name: 'manaSymbol' })
export class ManaSymbolPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(manaCost: string | null | undefined): SafeHtml {
    if (!manaCost) return '';
    const html = manaCost.replace(/\{([^}]+)\}/g, (_, sym) => {
      const bg = COLOR_MAP[sym.toUpperCase()] ?? '#888';
      return `<span class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold border border-black/30 mx-px"
        style="background:${bg};color:${sym === 'W' ? '#333' : '#fff'}">${sym}</span>`;
    });
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
