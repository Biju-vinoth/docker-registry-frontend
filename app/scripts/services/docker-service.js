'use strict';

// This is the main entrypoint to interact with the Docker registry.
// TODO: need to add ability to configure this service's URL

angular.module('docker-service', [])
  .factory('docker', ['$http', '$log', function($http, $log){

    var urlPrefix = '';

    var repositories = [];

    var selectedRepo = 'repo1';
    
    var searchTerm = '';
    
    // Stores { repoName1: {tag1}, repoName2: {tag2, tag3} }
    var tags = {};
    
    function getSearchTerm() {
      return searchTerm;
    }
    
    function selectRepository(repo){
      if (repo) {
        selectedRepo = repo;
      }
    };
    
    function isSelectedRepository(repo) {
      return selectedRepo === repo;
    }
    
    function getSelectedRepository(){
      return selectedRepo;
    };
    
    function getRepositories(){
      return repositories;
    }
    
    function fetchRepositories(term) {
      searchTerm = term;
      $log.info('Searching for repository with searchTerm = '+ searchTerm);
      $http.get(urlPrefix+'/v1/search?q='+searchTerm).
      success(function(data, status) {
        $log.debug('Successfully fetched repositories.');
        repositories = data.results;
      }).
      error(function(data, status) {
        $log.error('Failed to fetch repositories. status='+status+' data='+data);
      });
    }
    
    function fetchTags(repoPath) {
      $log.info('Searching for tags in repository = '+ repoPath);
      $http.get(urlPrefix+'/v1/repositories/'+repoPath+'/tags').
      success(function(data, status) {
        $log.info('Successfully fetched tags');
        tags[repoPath] = data;
      }).
      error(function(data, status) {
        $log.error('Failed to fetch tags. status='+status+' data='+data);
      });
    }
    
    function getTagsForRepo(repoPath){
      if (repoPath && tags.hasOwnProperty(repoPath)) {
        return tags[repoPath];
      }
      return {};
    }
    
    var data = {
      'urlPrefix': urlPrefix,
      'getRepositories': getRepositories,
      'selectRepository': selectRepository,
      'isSelectedRepository': isSelectedRepository,
      'getSelectedRepository': getSelectedRepository,
      'fetchRepositories': fetchRepositories,
      'getSearchTerm': getSearchTerm,
      'fetchTags': fetchTags,
      'getTagsForRepo': getTagsForRepo,
    };
    
    // This initalizes the docker repo data
    fetchRepositories('');
    
    return data;
    
  }]);