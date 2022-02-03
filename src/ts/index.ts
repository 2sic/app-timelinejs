let { Timeline } = require('../../node_modules/@knight-lab/timelinejs');

declare const $2sxc: any;
var winAny = window as any;

function init({ domAttribute, moduleId }: { domAttribute: string, moduleId: string}) {
  const sxc = $2sxc(moduleId);
  const timeLineElement = document.querySelector(`[${domAttribute}]`) as HTMLElement;

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
    .then((data: any) => {
      // #Upgrade Breaking Change #DeprecatedInstanceData
      // ------------------------------------------------------------
      // Old code using the `in`, the `ListContent` and `.List[...]` stream
      // ------------------------------------------------------------
      // var content = data.in.Default.List;
      // var listContent = data.in.ListContent.List[0];

      // Re-format streams that are contained in data
      let content = data.Default;
      let listContent = data.Header[0];
      let timelineData = getTimelineData(moduleId, content, listContent);

      const timelineOptions = {
        width: timeLineElement.offsetWidth,
        height: timeLineElement.offsetHeight,
        start_at_slide: listContent.StartAtSlide ?? 1,
        initial_zoom: listContent.StartZoomAdjust ?? 1,
        debug: true, // have to enable debug to not use default timeline-min.js
      };

      // Create the timeline
      new Timeline(timeLineElement, timelineData, timelineOptions);

      // add sc-element classes
      timeLineElement.querySelectorAll(`.tl-slide-content-container`).forEach((el) => { el.classList.add("sc-element"); });
    });
}

// Reformat data from 2sxcContent, so TimelineJS can work with it
function getTimelineData(moduleId: string, content: any, listContent: any) {
  let isEditMode = $2sxc(moduleId).isEditMode();

  if (isEditMode) {
    console.log(listContent)
    let listToolbar = $2sxc(moduleId).manage.getToolbar({
      entityId: listContent.Id,
      action: "edit"
    });
    listContent.Text += listToolbar;
  }


  return {
    title: {
      text: {
        headline: listContent.Title,
        text: listContent.Text
      },
      start_date: {
        year: setDate(listContent.StartDate)
      },
      end_date: { 
        year: setDate(listContent.EndDate) 
      },
      unique_id: `app-timelinejs2-${moduleId}`
    },
    events: content.map((event: any) => {
      if (isEditMode) {
        console.log(moduleId)
        console.log(event)
        let toolbar = $2sxc(moduleId).manage.getToolbar({ 
          entityId: event.Id,
          action: "new,edit" 
        });
        console.log(toolbar)
        event.Body += toolbar;
      }
      return {
        start_date: {
          year: setDate(event.StartDate)
        },
        end_date: { 
          year: setDate(event.EndDate)
        },
        text: {
          headline: event.Headline,
          text: event.Body
        },
        media: {
          url: event.Media,
          caption: event.MediaCaption,
          credit: event.MediaCredit
        },
        unique_id: `app-timelinejs2-${moduleId}`
      };
    })
  };
}

function setDate(date: string) {
  return new Date(date).getFullYear() ?? null
}

winAny.appTimelineJs2 = winAny.appTimelineJs2 || {};
winAny.appTimelineJs2.init = winAny.appTimelineJs2.init || init;
