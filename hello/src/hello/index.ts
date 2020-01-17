import {Rule, SchematicContext, Tree, apply, mergeWith, template, url, SchematicsException, move} from '@angular-devkit/schematics';
import {strings} from '@angular-devkit/core';
import {Schema} from './schema';
import {parseName} from '@schematics/angular/utility/parse-name';
import {buildDefaultPath} from '@schematics/angular/utility/project';
// import { addProviderToModule } from '@schematics/angular/utility/ast-utils';

export function hello(_options: Schema): Rule {
    console.log(__dirname);
  return (tree: Tree, _context: SchematicContext) => {
      const workspaceConfigBuffer = tree.read('angular.json');
      if (!workspaceConfigBuffer) {
          throw new SchematicsException('Not an Angular Cli workspace');
      }
      const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
      const projectName = _options.project || workspaceConfig.defaultProject;
      const project = workspaceConfig.projects[projectName];

      const defaultProjectPath = buildDefaultPath(project);
      const parsedPath = parseName(defaultProjectPath, _options.name);

      const {name} = parsedPath;
      _context.logger.warn(JSON.stringify(_options));
      _context.logger.warn(__dirname);

      const sourceTemplates = url('./files');
      const sourceParametrizedTemplates = apply(sourceTemplates, [
         template({
             ..._options,
             ...strings,
             name
         }),
          move(_options.path)
      ]);
      return mergeWith(sourceParametrizedTemplates) (tree, _context);
  };
}
