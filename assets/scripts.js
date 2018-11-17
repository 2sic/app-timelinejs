
$(function () {

  // Process each Timeline DOM-element on the page
  $(".timeline-embed").each(function () {

    // Define our timeline element, get moduleId
    var timeLineElement = $(this);

    // old sxc-initalizer, before 2sxc 8; included for reference if you have an older 2sxc
    // var moduleId = timeLineElement.attr("data-moduleid");
    // var sxc = $2sxc(moduleId);

    // new method since 2sxc 8, using the simpler DOM initializer - see https://github.com/2sic/2sxc/wiki/JavaScript-%242sxc
    var sxc = $2sxc(this);

    // Load the data from the 2SexyContent module and define a callback
    sxc.data.on("load", function (source, data) {
      processDataAndCreateTimeline(source, data, sxc.id, timeLineElement)
    }).load();

  });

  // what should happen on loading of the data:
  function processDataAndCreateTimeline(source, data, moduleId, timeLineElement) {

    // Re-format streams that are contained in data
    var content = data.in.Default.List;
    var listContent = data.in.ListContent.List[0];
    var timelineData = getTimelineData(moduleId, content, listContent);
    var additionalOptions = {
      width: timeLineElement.width(),
      height: timeLineElement.height(),
      start_at_slide: listContent.StartAtSlide,
      initial_zoom: listContent.StartZoomAdjust,
      scale_factor: 1
    }

    // Create the timeline
    var timeline = new TL.Timeline(timeLineElement.attr("id"), timelineData, additionalOptions);
  }

  // Reformat data from 2sxcContent, so TimelineJS can work with it
  function getTimelineData(moduleId, content, listContent) {

    var isEditMode = $2sxc(moduleId).isEditMode();

    if (isEditMode) {
      var listToolbar = $2sxc(moduleId).manage.getToolbar({ "entity": listContent, "action": "edit" });
      listContent.Text += listToolbar;
    }

    var timelineData = {
      "unique_id": "timeline-embed-" + moduleId,
      "title": {
        "startDate": FormatDate(listContent.StartDate),
        "text": {
          "headline": listContent.Headline,
          "text": listContent.Text
        }
      },
      "events": $.map(content, function (entry) {

        if (isEditMode) {
          var toolbar = $2sxc(moduleId).manage.getToolbar([{ "entity": entry, "action": "edit" }, { "entity": entry, "action": "new" }]);
          entry.Body += toolbar;
        }

        return {
          "start_date": FormatDate(entry.StartDate),
          "end_date": FormatDate(entry.EndDate),
          "text": {
            "headline": entry.Headline,
            "text": entry.Body
          },
          "media": {
            "url": entry.Media,
            // "url": "http://free.pagepeeker.com/v2/thumbs.php?size=x&url=" + entry.Media,
            "caption": entry.MediaCaption,
            "credit": entry.MediaCredit
          }
        };
      })
    };
    return timelineData;
  }

  function FormatDate(dateString) {
    var date = new Date(dateString);
    return {
      "year": date.getFullYear(),
      "month": (date.getMonth() + 1),
      "day": date.getDate()
    };
  }

});
