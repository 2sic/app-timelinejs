
$(document).ready(function () {

    // Process each Timeline element on the page
    $(".timeline-embed").each(function() {

        // Define our timeline element, get moduleId
        var timeLineElement = $(this);
        var moduleId = timeLineElement.attr("data-moduleid");

        // Load the data from the 2SexyContent module and define a callback
        $2sxc(moduleId).data.on("load", function (source, data) {

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
                start_zoom_adjust: listContent.StartZoomAdjust
            });

        }).load();

    });

});

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