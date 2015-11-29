getshuju(string username, string token, string id,string shujuleixing).参照输入框加载数据api。参数中id为该参照框的id。Shujuleixing中，如果是报表条件需要的参照输入，则输入baobiaotiaojian，，如果是数据录入主表需要的参照数据，则输入mobandangan，如果是报表子表需要的数据录入，则输入biaojiegou。有类别的数据，则返回名为leibie的json数据。内容包括id，mingcheng，bianma，leibielujing。Mingcheng：显示的名称；bianma：编码；leibielujing：类别全名。没有类别的数据，则直接返回该档案的前20行

getmohucx(string username, string token, string id, string yeshu, string guanjianzi,string shujuleixing)。模糊查询API。如果是报表条件需要的参照输入，则输入baobiaotiaojian，，如果是数据录入主表需要的参照数据，则输入mobandangan，如果是报表子表需要的数据录入，则输入biaojiegou。

getleibiecx(string username, string token, string id, string yeshu, string leibieid, string guanjianzi,string shujuleixing)
新增类别查询
