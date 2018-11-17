
$(function () {

    // Process each Timeline DOM-element on the page
    $(".timeline-embed").each(function() {

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
    function processDataAndCreateTimeline (source, data, moduleId, timeLineElement) {

        // Re-format streams that are contained in data
        var content = data.in.Default.List;
        var listContent = data.in.ListContent.List[0];
        var timelineData = getTimelineData(moduleId, content, listContent);

        // Create the timeline
        createStoryJS({
            type: 'timeline',
            width: '' + timeLineElement.width(),
            height: timeLineElement.height(),
            source: timelineData,
            embed_id: timeLineElement.attr("id"),
            start_at_slide: listContent.StartAtSlide,
            start_zoom_adjust: listContent.StartZoomAdjust,
            js: 'timeline.js', // path to local timeline.js with DNN v9.2.2 compatibility hotfix
            debug: true, // have to enable debug to not use default timeline-min.js
        });

    }


    // Reformat data from 2sxcContent, so TimelineJS can work with it
    function getTimelineData(moduleId, content, listContent) {

        var isEditMode = $2sxc(moduleId).isEditMode();

        if (isEditMode) {
            var listToolbar = $2sxc(moduleId).manage.getToolbar({ "entity": listContent, "action": "edit" });
            listContent.Text += listToolbar;
        }

        var timelineData = {
            "timeline": {
                "headline": listContent.Headline,
                "type": "default",
                "text": listContent.Text,
                "startDate": FormatDate(listContent.StartDate),
                "date": $.map(content, function (entry) {

                    if (isEditMode) {
                        var toolbar = $2sxc(moduleId).manage.getToolbar([{ "entity": entry, "action": "edit" }, { "entity": entry, "action": "new" }]);
                        entry.Body += toolbar;
                    }

                    return {
                        "startDate": FormatDate(entry.StartDate),
                        "endDate": FormatDate(entry.EndDate),
                        "headline": entry.Headline,
                        "text": entry.Body,
                        "classname": "sc-element",
                        "asset": {
                            "media": entry.Media,
                            "credit": entry.MediaCredit,
                            "caption": entry.MediaCaption
                        }
                    };
                })
            }
        };
        return timelineData;
    }

    function FormatDate(dateString) {
        var date = new Date(dateString);
        return date.getFullYear() + "," + (date.getMonth() + 1) + "," + date.getDate() + ",";
    }



});
