# DEP Digital Journey Prototype

This is the centralised DEP Digital Journey prototype, based on the [GOV.UK Prototype Kit](https://govuk-prototype-kit.herokuapp.com/docs/about).

## Installation instructions

1. Install dependencies: `npm i`
2. Run the prototype: `npm start`
3. View by going to [localhost:3000](localhost:3000) in your browser.

## Designer Overview
The prototype has been set up in such a way as to minimise the need for writing and editing JavaScript when designing pages and flows. With that in mind, only a subset of the files and directories are relevant for day-to-day prototyping:
* **Journey Config** (`journeys.yml`) - Configure various journeys
  * Switch between journeys at runtime by using the "Switch journey" link in the footer
  * Set the default journey in this file
* **Views** (`app/views/`) - HTML/Nunjucks files representing pages and page components
  * By default, each of the files in this directory can be accessed in the browser by visiting their relative filepath, e.g. `app/views/personal-details/confirm-name.html` will be available at `/personal-details/confirm-name` in the application
  * Reusable components can be defined in the `components/` subdirectory and referenced in any view
* **Task Library** (`app/journey/tasks/`) - Set of tasks available for use in the Journey Config
  * Based on `TaskBase.js` at `app/journey/`, check this file for documentation of the available settings (e.g. how to set display names, dependencies, completion conditions etc.)
  * For more information about adding new tasks, see [Adding a new Task](#adding-a-new-task).
* **Custom Styles** (`app/assets/sass`) - Add custom CSS to files in the `components/` subdirectory, importing any new files in `main.scss`.
* **Custom Routes** (`app/routes`) - Useful for implementing routing logic for multi-stage tasks.

## Usage
Within the Task List system, journeys and screens are added as **Tasks** or **Sub-Tasks** to a particular **Section**.

It's important to distinguish between **multi-stage tasks** and **tasks with sub-tasks**:
* A **multi-stage task** is a task with several **non-configurable** stages, i.e. a task which would not be able to function without each of its defined stages. Examples of these from CTAS include "Household Contacts" or "Work And Education", which are comprised of several potentially-looping pages which would not make sense in isolation. Within a multi-stage path, each screen (whether that's the view or a route) is responsible for navigation.
* A **task with sub-tasks** is closer in nature to a section, in that the sub-tasks can be included or excluded without impacting other sub-tasks. Examples of these include the Personal Details section, which may or may not (depending on journey) include sub-tasks such as "NHS Number" or "Confirm Phone Number".

### Adding a new Section
Adding a section is the simplest part, as all a section is under the hood is a title and a collection of tasks:

1. Add the underscored version of the desired section title to the `journeys` object in `journeys.yml`.
2. Add any desired tasks as an ordered list below the section title.

### Adding a new Simple Task
A **Simple** Task is either:
* A task with no sub-tasks
* A sub-task

If the task library doesn't contain the task you're looking for to add to a section, you'll need to create a new Task and add any corresponding views.

1. In the `app/journey/tasks/` folder, make a copy of `ExampleTask.js` and update the filename and classname as desired. Both names should match, be in `PascalCase` and have `Task` as the suffix. Add the new task to the export object in `app/journey/tasks/index.js` to make it available.
2. Provide return values for the functions marked as **`REQUIRED`**, such as `title()` and `defaultEntryPoint()`.
3. Provide return values for any **`OPTIONAL`** functions as per the requirements, such as `prerequisities()` for tasks which depend on other tasks, or `requiredFor()` for tasks that may not need to be completed by all users within a given journey. Delete any unused `OPTIONAL` functions - their functionality is preserved by the base class.
4. Create a new view at the same filepath as defined by the `defaultEntryPoint()` function, e.g. if the default entry point is defined as `/personal-details/confirm-email` then the new file should be `app/routes/personal-details/confirm-email.html`. Design view as required.
5. Add the new task to the desired section or higher-level task in one or more of the journeys defined in the Journey Config. The classname should be translated to `snake_case` with the `Task` suffix omitted, e.g:
    * To add `ConfirmEmailTask` as a _top-level_ task (i.e. one that appears in the Task List) in, say, the About You section, the Journey Config would look something like:

        ```yaml
        journeys:
          covid_19:
            about_you:
              - confirm_email
        ```

    * To add `ConfirmEmailTask` as a _sub-task_ in, say, the Personal Details task, the Journey Config would instead look something like:

        ```yaml
        journeys:
          covid_19:
            about_you:
              - personal_details:
                - confirm_email
        ```


### Adding a new Task with Sub-tasks
To add a new task with sub-tasks, follow the steps for adding a new simple task for each sub-task _and_ the top-level task. If the top-level task is not likely to be reused as a Simple task in any other journey, step 4 can be omitted.

No further action is required as the routing logic is handled by the Journey Manager.

### Adding a new Muti-Stage Task
To add a new **multi-stage** task, follow steps 1-3 for adding a new simple task for each sub-task. Then:

4. Create a new view for each stage in the task. The first stage in the task should have a filepath corresponding to the `defaultEntryPoint()` function return in the Task definition (see Step 2). Design each view as required.
5. For simple routing logic (e.g. Press one button to go here, press another to go there), ensure the `href` attribute on each button has been set appropriately.
5. For complex routing logic (e.g. based on user input in a form), create custom routes to define the routing logic between stages. For example, if the task requries more details based on the data inputted on the `/visits/activities` view, create a `POST` route for `/visits/activities` which routes the user based on the contents of request body. An example of this can be found in the `/switch-journey` route towards the bottom of `app/routes/index.js`.

---

## Limitations
The prototype framework is still in an early phase of development and as such there are a few limitations. Where engineering capacity allows, these limitations will eventually be addressed.

* One-to-One mapping between tasks and their pages
  * Currently, it is not possible to re-use a task in two different journeys and give each version of the task a different page design. Instead, a task needs to be created for each page design.


## Questions
If have any questions or you find any more limitations that block potential designs from being effectively prototyped, please get in contact with [Rhys Barrett](mailto:rhys.barrett@test-and-trace.nhs.uk).
