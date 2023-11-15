import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VisualizeAlgoSerivce } from 'src/app/algorithms/services/visualizeAlgo.service';
import { NodeInterface } from '../../../shared/types/node.interface';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.styles.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NodeComponent {
  elementClass = '';

  @Input() row: NodeInterface[] = [];

  constructor(
    private nodeService: NodeService,
    public visualizeAlgoSvc: VisualizeAlgoSerivce
  ) {}

  isDraggable(node: NodeInterface): boolean {
    return node.isStart || node.isEnd ? true : false;
  }

  dragStart(event: DragEvent): void {
    const domEl = event.target as HTMLElement;
    this.nodeService.dragStart(domEl);
  }

  dragEnter(event: DragEvent): void {
    const entered = event.target as HTMLElement;
    this.nodeService.dragEnter(entered);
  }

  dragLeave(event: DragEvent) {
    const leftElement = event.target as HTMLElement;
    leftElement.classList.remove('drag-enter');
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
  }

  dragDrop(event: DragEvent): void {
    const domEl = event.target as HTMLElement;
    this.nodeService.dragDrop(domEl);
  }
}
