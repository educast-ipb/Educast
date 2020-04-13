export const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cutting_tool_data version="1.0" lang="en">
  <!-- version x.y
         x: strucuture of this xml has changed
         y: additional tags
       lang (en|de|fr|it)
  -->
  <title_left read_only="true">Editing Clip 34114 - Editor</title_left>
  <title_right read_only="true">Channel 4735 - HTML5 Novo editor IPB</title_right>
  <auth_token> a auth token</auth_token>
  <update_url read_only="true">https://educast.fccn.pt/clips/34114/cutting_tool_data.xml?locale=en</update_url>
  <action>save</action>
  <status read_only="true">ok</status>
  <video_streams>
    <duration read_only="true">0:00:03:23.067</duration>
    <presenter kind="video">
      <url read_only="true">rtmp://livestream02.fccn.pt/EducastEditor/mp4:cast/lkuz0os04/Medias/0258xx/Media_025859/ProducedMedias/flash_cutting_V1_presenter_41</url>
      <width read_only="true">320</width>
      <height read_only="true">240</height>
    </presenter>
    <screens>
      <url read_only="true">rtmp://livestream02.fccn.pt/EducastEditor/mp4:cast/lkuz0os04/Medias/0258xx/Media_025859/ProducedMedias/flash_cutting_V1_screens_41</url>
      <width read_only="true">320</width>
      <height read_only="true">240</height>
      <cropping_margins>
        <!-- The margin value is comma separated list of floats from 0..<1
             and represents the percentaged distance from the border.
               margin := <top>,<right>,<bottom>,<left>
        -->
      </cropping_margins>
      <color_corrections>
        <!-- The color correction is defined by a white point and a black point. These to colors
             define which colors should be white and black. The value is a comma separated list of
             integers from 0..255 and represents an RGB color.
               white_point := <red>,<green>,<blue>
               black_point := <red>,<green>,<blue>
        -->
      </color_corrections >
    </screens>
  </video_streams>
  <clip>
    <metadata>
      <title label="Title" type="string" validation="/^.{0,100}$/" validation_error_text="Title too long (max. 100 characters)" default=""
             description="Title of this clip" position="1">
        Editor
      </title>
      <subtitle label="Subtitle" type="string" validation="/^.{0,100}$/" validation_error_text="Subitle too long (max. 100 characters)" default=""
                description="Subtitle of this clip" position="2">
        Subtitlo do Editor
      </subtitle>
      <presenter label="Presenter" type="string" validation="/^.{0,100}$/" validation_error_text="Presenter too long (max. 100 characters)" default=""
                 description="Who is the presenter in this clip" position="3">
        Nelson Dias
      </presenter>
      <location label="Location" type="string" validation="/^.{0,100}$/" validation_error_text="Location too long (max. 100 characters)" default=""
                description="Where was the recording taken" position="4">
        Lisboa
      </location>
      <issued_on label="Date" type="string" validation="/^.{0,50}$/" validation_error_text="Date too long (max. 50 characters)" default=""
                 description="When was the recording taken (the format DD.MM.YYYY [hh:mm] is recommanded)" position="5">
        13.02.2020 10:43
      </issued_on>
    </metadata>
    <scenes>
    </scenes>
    <chapters property_update_marker_thumbnail="https://educast.fccn.pt/clips/34114/cutting_tool_data/chapter_thumbnail.js?locale=en"
              property_validation_title="/^.{0,50}$/">
    </chapters>
    <delivery_config>
      <cover_image_url read_only="true" update_url="https://educast.fccn.pt/clips/34114/cutting_tool_data/update_image.js?locale=en" property_name="cover_image">https://educast.fccn.pt/img/clips/2jcdfpptkn/tmp/chapters/0</cover_image_url>
      <cover_image_marker_in></cover_image_marker_in>
      <header_image_url read_only="true" update_url="https://educast.fccn.pt/clips/34114/cutting_tool_data/update_image.js?locale=en" property_name="header_image">https://educast.fccn.pt/img/clips/2jcdfpptkn/source/header</header_image_url>
      <footer_image_url read_only="true" update_url="https://educast.fccn.pt/clips/34114/cutting_tool_data/update_image.js?locale=en" property_name="footer_image">https://educast.fccn.pt/img/clips/2jcdfpptkn/source/footer</footer_image_url>
      <presenter_position>right</presenter_position>
      <presenter_video_visible>true</presenter_video_visible>
      <screens_video_visible>true</screens_video_visible>
      <delivery_formats>
        <delivery_format>Mobile</delivery_format>
        <delivery_format>Desktop</delivery_format>
        <delivery_format>Streaming Flash</delivery_format>
        <delivery_format>Streaming HTML5</delivery_format>
      </delivery_formats>
      <auto_publish>on</auto_publish>
    </delivery_config>
    <state read_only="true">modified</state>
  </clip>
</cutting_tool_data>`;
