import { EnvironmentDto } from '@algotech-ce/core';
import { expect } from 'chai';
import { EnvironmentDirectoryDtoBuilder } from '../../../../../test-utils/builders/EnvironmentDirectoryDto.builder';
import { EnvironmentService } from './environment.service';

describe(EnvironmentService.name, () => {
    const service = new EnvironmentService(null);
    const testDirs = [
        new EnvironmentDirectoryDtoBuilder()
            .withUuid('1000').withName('dirA')
            .build(),
        new EnvironmentDirectoryDtoBuilder()
            .withUuid('2000').withName('dirB')
            .build(),
        new EnvironmentDirectoryDtoBuilder()
            .withUuid('3000').withName('dirC')
            .build(),
        new EnvironmentDirectoryDtoBuilder()
            .withUuid('4000')
            .withName('dirD')
            .withSubDirectories([
                new EnvironmentDirectoryDtoBuilder()
                    .withUuid('4100').withName('dirDA')
                    .build(),
                new EnvironmentDirectoryDtoBuilder()
                    .withUuid('4200').withName('dirDB')
                    .withSubDirectories([
                        new EnvironmentDirectoryDtoBuilder()
                            .withUuid('4210').withName('dirDBA')
                            .build(),
                        new EnvironmentDirectoryDtoBuilder()
                            .withUuid('4220').withName('dirB') // same name as dir 2000
                            .build()
                    ])
                    .build()
            ])
            .build(),
    ];

    describe(EnvironmentService.prototype.getAllDirectoriesFullname.name, () => {
        it('should return the flat list of directories and subdirectories with full path as name', () => {
            // WHEN
            const results = service.getAllDirectoriesFullname(testDirs);
            // THEN
            expect(results.length).to.equal(8);
            expect(results.map(dir => dir.name)).to.have.members([
                'dirA',
                'dirB',
                'dirC',
                'dirD',
                'dirD/dirDA',
                'dirD/dirDB',
                'dirD/dirDB/dirDBA',
                'dirD/dirDB/dirB',
            ]);
        });
    });

    describe(EnvironmentService.prototype.getDirectoryUUIDByPath.name, () => {
        it('should find the right directory and return its UUID', () => {
            // GIVEN
            const environment: EnvironmentDto = {
                workflows: testDirs,
                smartmodels: [],
                smartflows: [],
                reports: [],
                apps: [],
                smartTasks: []
            };

            // WHEN
            const result = service.getDirectoryUUIDByPath(environment, 'workflow', '/dirC');

            // THEN
            expect(result).to.equal('3000');
        });
        it('should find the right subdirectory and return its UUID', () => {
            // GIVEN
            const environment: EnvironmentDto = {
                workflows: testDirs,
                smartmodels: [],
                smartflows: [],
                reports: [],
                apps: [],
                smartTasks: []
            };

            // WHEN
            const result = service.getDirectoryUUIDByPath(environment, 'workflow', '/dirD/dirDB/dirDBA');

            // THEN
            expect(result).to.equal('4210');
        });
    });
});
