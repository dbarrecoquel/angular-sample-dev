import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import { SubProject } from '../models/sub-project.model';

@Component({

    selector : 'app-dashboard',
    imports : [],
    templateUrl : './dashboard.html',
    styleUrl : './dashboard.scss'

})
export class Dashboard {

    private readonly router = inject(Router);

     readonly subProjects: SubProject[] = [
    {
      id: 'todos',
      name: 'Todo List',
      description: 'Gerez vos taches : creation, edition, suppression et suivi de progression.',
      icon: '✅',
      route: '/todos',
      color: '#4f46e5'
    },
    {
      id: 'notes',
      name: 'Notes',
      description: 'Bientot disponible : prenez des notes rapides et organisez-les par tag.',
      icon: '📝',
      route: '',
      color: '#059669'
    },
    {
      id: 'contacts',
      name: 'Contacts',
      description: 'Bientot disponible : centralisez vos contacts et coordonnees.',
      icon: '👥',
      route: '',
      color: '#d97706'
    }
  ];

  open(subProject : SubProject){
    if (!subProject.route)
        return;
    this.router.navigateByUrl(subProject.route);
  }

}