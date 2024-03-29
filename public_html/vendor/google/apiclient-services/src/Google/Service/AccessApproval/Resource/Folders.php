<?php
/*
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * The "folders" collection of methods.
 * Typical usage is:
 *  <code>
 *   $accessapprovalService = new Google_Service_AccessApproval(...);
 *   $folders = $accessapprovalService->folders;
 *  </code>
 */
class Google_Service_AccessApproval_Resource_Folders extends Google_Service_Resource
{
  /**
   * Gets the settings associated with a project, folder, or organization.
   * (folders.getAccessApprovalSettings)
   *
   * @param string $name Name of the AccessApprovalSettings to retrieve.
   * @param array $optParams Optional parameters.
   * @return Google_Service_AccessApproval_AccessApprovalSettings
   */
  public function getAccessApprovalSettings($name, $optParams = array())
  {
    $params = array('name' => $name);
    $params = array_merge($params, $optParams);
    return $this->call('getAccessApprovalSettings', array($params), "Google_Service_AccessApproval_AccessApprovalSettings");
  }
  /**
   * Updates the settings associated with a project, folder, or organization.
   * Completely replaces the existing settings.
   * (folders.updateAccessApprovalSettings)
   *
   * @param string $name The resource name of the settings. Format is one of:
   *
   *   "projects/{project_id}/accessApprovalSettings"
   * "folders/{folder_id}/accessApprovalSettings"
   * "organizations/{organization_id}/accessApprovalSettings"
   * @param Google_Service_AccessApproval_AccessApprovalSettings $postBody
   * @param array $optParams Optional parameters.
   * @return Google_Service_AccessApproval_AccessApprovalSettings
   */
  public function updateAccessApprovalSettings($name, Google_Service_AccessApproval_AccessApprovalSettings $postBody, $optParams = array())
  {
    $params = array('name' => $name, 'postBody' => $postBody);
    $params = array_merge($params, $optParams);
    return $this->call('updateAccessApprovalSettings', array($params), "Google_Service_AccessApproval_AccessApprovalSettings");
  }
}
