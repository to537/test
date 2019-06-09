var url = "https://raw.githubusercontent.com/jigjp/intern_exam/master/fukui_event.json"

var appf = new Vue({
    el:'#app-form',
    data:{
        keyword:'',//キーワード
        many:10000,//絞り込み件数
        results:[],//要素全部
        filteredResults:[],//キーワードで抽出後
        list:[],//件数絞り込み後
        start_num:0,//1ページ目
        end_num:100,//最後のページ
        now_num:0,//現在のページ
        noElementsOfBack:true,//前へボタン無効
        noElementsOfNext:true//次へボタン無効
    },
    mounted(){//データを取ってくる
        axios.get(url)
        .then((response)=>{this.results=this.filteredResults=this.list=response.data;})
    
        this.noElementsOfBack=true;
        this.noElementsOfNext=true;
    },    
    methods:{
        setNum:function(){//ページの全数を設定
            this.end_num = this.list.length/this.many;
            console.log(this.list);
            console.log(this.end_num);
            console.log(this.many);
            this.now_num=0;//現在のページを初期化
            if(this.end_num>1.0){//2ページ以上あり
                //console.log("have next page");
                this.haveNext();
                this.notHaveBack();//「前へ」無効
            }else if(this.end_num<1.0){//1ページ分しかない
                this.notHaveNext();//「次へ」無効
                this.notHaveBack();//「前へ」無効
            }
        },
        search: function(){//キーワード検索
            if(!this.keyword){//キーワード指定なし
                this.filteredResults=this.results;
            }else{
                var filterword = this.keyword && this.keyword.toLowerCase();
                this.filteredResults=this.results.filter(function(row){
                    return Object.keys(row).some(function(key){
                        return String(row[key]).toLowerCase().indexOf(filterword) > -1;
                    })
                })
            }//filteredResultsの中身を決定
        },
        decide:function(){//検索ボタン
            //this.list=this.search();//キーワードで絞り込み
            this.search();//キーワードで絞り込み
            this.action(this.many);
            console.log(this.results);
            console.log(this.keyword);
            console.log(this.list);
        },
        action: function(n){//件数絞り込みボタン
            this.many=n;
            if(n==10000){//全件表示を選択
                this.list=this.filteredResults;
                this.notHaveBack();
                this.notHaveNext();
            }else{
                //console.log("n!=10000");
                this.setNum();//ページ初期化
                //最初のページを表示
                this.list=this.filteredResults.slice(this.now_num*this.many,(this.now_num+1)*this.many);
                //console.log("noElemNext = "+this.noElementsOfNext);
            }
        },
        inc: function(go){
            console.log("inc is called");
            if(go=='next'){//次へボタン
                //次のページを表示
                this.now_num++; 
                this.list=this.filteredResults.slice(this.now_num*this.many,(this.now_num+1)*this.many);
                this.haveBack();//「前へ」無効
                if(this.now_num<this.end_num){
                    this.haveNext();//最後のページでないときは「次へ」有効
                }else{
                    this.notHaveNext();//「次へ」を無効化
                }
            }else if(go=='back'){//前へボタン
                //前のページを表示
                this.now_num--;    
                this.list=this.filteredResults.slice(this.now_num*this.many,(this.now_num+1)*this.many);
                this.haveNext();//「次へ」有効
                if(this.now_num>this.start_num){
                    this.haveBack();//最初のページでないときは「前へ」有効
                }else{
                    this.notHaveBack();//「前へ」を無効化
                }
            }
        },
        haveNext:function(){
            this.noElementsOfNext=false;
        },
        haveBack:function(){
            this.noElementsOfBack=false;
        },
        notHaveNext:function(){
            this.noElementsOfNext=true;
        },
        notHaveBack:function(){
            this.noElementsOfBack=true;
        }
    },
    
});

