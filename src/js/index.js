import { Timeline } from "@knight-lab/timelinejs";


function init({ domAttribute, moduleId }) {
  const sxc = $2sxc(moduleId);
  const timeLineElement = document.querySelector(`[${domAttribute}]`);

  // #Upgrade Breaking Change #DeprecatedInstanceData
  // ------------------------------------------------------------
  // This is the old code using the now deprecated data-on
  // We are leaving this here for people to see when they want to upgrade old apps
  // Load the data from the 2SexyContent module and define a callback
  // ------------------------------------------------------------
  // sxc.data.on("load", function (source, data) {
  //     processDataAndCreateTimeline(source, data, sxc.id, timeLineElement)
  // }).load();

  // New version using fetch and the default Query we just created
  sxc.webApi
    .fetchJson("app/auto/query/ModuleData")
    .then((data) => processDataAndCreateTimeline(data, moduleId, timeLineElement));
}

// what should happen on loading of the data:
function processDataAndCreateTimeline(data, moduleId, timeLineElement) {
  // #Upgrade Breaking Change #DeprecatedInstanceData
  // ------------------------------------------------------------
  // Old code using the `in`, the `ListContent` and `.List[...]` stream
  // ------------------------------------------------------------
  // var content = data.in.Default.List;
  // var listContent = data.in.ListContent.List[0];

  // Re-format streams that are contained in data
  var content = data.Default;
  var listContent = data.Header[0];
  var timelineData = getTimelineData(moduleId, content, listContent);

  const timelineOptions = {
    width: timeLineElement.offsetWidth,
    height: timeLineElement.offsetHeight,
    start_at_slide: listContent.StartAtSlide ?? 1,
    initial_zoom: listContent.StartZoomAdjust ?? 1,
    debug: true, // have to enable debug to not use default timeline-min.js
  };

  // Create the timeline
  new Timeline(timeLineElement, timelineData, timelineOptions);
}

// Reformat data from 2sxcContent, so TimelineJS can work with it
function getTimelineData(moduleId, content, listContent) {
  var isEditMode = $2sxc(moduleId).isEditMode();

  if (isEditMode) {
    var listToolbar = $2sxc(moduleId).manage.getToolbar({
      entity: listContent,
      action: "edit",
    });
    listContent.Text += listToolbar;
  }

  return {
    title: {
      title: listContent.Title,
      start_date: {
        year: new Date(listContent.StartDate).getFullYear() ?? null,
      },
      end_date: { 
        year: new Date(listContent.EndDate).getFullYear() ?? null 
      },
      unique_id: `app-timelinejs2-${moduleId}`
    },
    events: content.map((event) => {
      if (isEditMode) {
        var toolbar = $2sxc(moduleId).manage.getToolbar([
          { entity: event, action: "edit" },
          { entity: event, action: "new" },
        ]);
        event.Body += toolbar;
      }
      return {
        start_date: {
          year: new Date(event.StartDate).getFullYear() ?? null,
        },
        end_date: { 
          year: new Date(event.EndDate).getFullYear() ?? null
        },
        text: {
          headline: event.Headline,
          text: event.Body,
        },
        media: {
          url: event.Media,
          caption: event.MediaCaption,
          credit: event.MediaCredit,
        },
        unique_id: `app-timelinejs2-${moduleId}`
      };
    })
  };
}

let winAny = window
winAny.appTimelineJs2 = winAny.appTimelineJs2 || {};
winAny.appTimelineJs2.init = winAny.appTimelineJs2.init || init;
