import { Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[appWordCount]',
  standalone: true
})

export class WordCountDirective implements OnChanges {
  @Input() noteContent: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    const wordCount = this.noteContent ? this.noteContent.trim().split(/\s+/).length : 0;
    this.el.nativeElement.innerText = `Word Count: ${wordCount}`;
  }
}
